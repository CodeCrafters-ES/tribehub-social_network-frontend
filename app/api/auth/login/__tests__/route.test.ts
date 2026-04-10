/**
 * @jest-environment node
 *
 * Unit tests for the BFF login route: app/api/auth/login/route.ts
 *
 * The route imports next/server which requires the Web Fetch API globals
 * (Request, Response, Headers). These are available natively in Node 18+ so
 * we use the "node" jest environment instead of the default jsdom one.
 * global.fetch is replaced with a jest.fn() to intercept backend calls
 * without making real network requests.
 */

import {
  SESSION_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from '@/features/auth/constants';

// ---------------------------------------------------------------------------
// Mock global fetch — used by the route to call the real backend
// ---------------------------------------------------------------------------

const fetchMock = jest.fn();

beforeAll(() => {
  global.fetch = fetchMock;
});

beforeEach(() => {
  // jest.setup.js sets NEXT_PUBLIC_API_BASE_URL for other test files.
  // Clear it here so the route's getBackendBaseUrl() returns '' by default
  // unless a specific test sets AUTH_API_BASE_URL.
  delete process.env.NEXT_PUBLIC_API_BASE_URL;
  delete process.env.AUTH_API_BASE_URL;
});

afterEach(() => {
  fetchMock.mockReset();
  delete process.env.AUTH_API_BASE_URL;
  delete process.env.NEXT_PUBLIC_API_BASE_URL;
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeBackendResponse(
  status: number,
  body: unknown,
  ok: boolean = status >= 200 && status < 300,
): Response {
  return {
    ok,
    status,
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

function makeRequest(body: unknown): Request {
  return {
    json: () => Promise.resolve(body),
  } as unknown as Request;
}

const validPayload = { email: 'user@example.com', password: 'secret123' };

const backendSuccessBody = {
  success: true,
  message: 'Login exitoso.',
  data: {
    accessToken: 'access-token-value',
    refreshToken: 'refresh-token-value',
    user: { id: 'u1', email: 'user@example.com' },
  },
};

// Import the route handler dynamically. jest.resetModules() before each call
// ensures that env vars set in beforeEach are picked up freshly by the module.
async function importPOST() {
  jest.resetModules();
  const mod = await import('@/app/api/auth/login/route');
  return mod.POST;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('POST /api/auth/login (BFF route)', () => {
  describe('configuration guard', () => {
    it('returns 500 when AUTH_API_BASE_URL is not set', async () => {
      const POST = await importPOST();

      const response = await POST(makeRequest(validPayload));
      const body = await response.json() as { message: string };

      expect(response.status).toBe(500);
      expect(body.message).toMatch(/AUTH_API_BASE_URL/);
    });
  });

  describe('payload validation', () => {
    beforeEach(() => {
      process.env.AUTH_API_BASE_URL = 'http://backend:3000/api/v1';
    });

    it('returns 400 when the request body is null', async () => {
      const POST = await importPOST();

      const response = await POST(makeRequest(null));
      expect(response.status).toBe(400);
    });

    it('returns 400 when email is missing', async () => {
      const POST = await importPOST();

      const response = await POST(makeRequest({ password: 'secret' }));
      expect(response.status).toBe(400);
    });

    it('returns 400 when password is missing', async () => {
      const POST = await importPOST();

      const response = await POST(makeRequest({ email: 'user@example.com' }));
      expect(response.status).toBe(400);
    });

    it('returns 400 when email is an empty string', async () => {
      const POST = await importPOST();

      const response = await POST(makeRequest({ email: '', password: 'secret' }));
      expect(response.status).toBe(400);
    });
  });

  describe('backend forwarding', () => {
    beforeEach(() => {
      process.env.AUTH_API_BASE_URL = 'http://backend:3000/api/v1';
    });

    it('calls the backend /auth/login endpoint', async () => {
      fetchMock.mockResolvedValueOnce(makeBackendResponse(200, backendSuccessBody));
      const POST = await importPOST();

      await POST(makeRequest(validPayload));

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(url).toBe('http://backend:3000/api/v1/auth/login');
    });

    it('forwards email and password to the backend', async () => {
      fetchMock.mockResolvedValueOnce(makeBackendResponse(200, backendSuccessBody));
      const POST = await importPOST();

      await POST(makeRequest(validPayload));

      const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
      const sentBody = JSON.parse(options.body as string) as {
        email: string;
        password: string;
      };
      expect(sentBody.email).toBe(validPayload.email);
      expect(sentBody.password).toBe(validPayload.password);
    });
  });

  describe('success response', () => {
    beforeEach(() => {
      process.env.AUTH_API_BASE_URL = 'http://backend:3000/api/v1';
    });

    it('returns 200 on a valid backend response', async () => {
      fetchMock.mockResolvedValueOnce(makeBackendResponse(200, backendSuccessBody));
      const POST = await importPOST();

      const response = await POST(makeRequest(validPayload));

      expect(response.status).toBe(200);
    });

    it('includes the user in the response body', async () => {
      fetchMock.mockResolvedValueOnce(makeBackendResponse(200, backendSuccessBody));
      const POST = await importPOST();

      const response = await POST(makeRequest(validPayload));
      const body = await response.json() as { user: { id: string; email: string } };

      expect(body.user).toEqual(backendSuccessBody.data.user);
    });

    it(`sets the ${SESSION_COOKIE_NAME} httpOnly cookie`, async () => {
      fetchMock.mockResolvedValueOnce(makeBackendResponse(200, backendSuccessBody));
      const POST = await importPOST();

      const response = await POST(makeRequest(validPayload));

      const setCookieHeader = response.headers.get('set-cookie') ?? '';
      expect(setCookieHeader).toContain(SESSION_COOKIE_NAME);
      expect(setCookieHeader.toLowerCase()).toContain('httponly');
    });

    it(`sets the ${REFRESH_TOKEN_COOKIE_NAME} httpOnly cookie when a refresh token is present`, async () => {
      fetchMock.mockResolvedValueOnce(makeBackendResponse(200, backendSuccessBody));
      const POST = await importPOST();

      const response = await POST(makeRequest(validPayload));

      const setCookieHeader = response.headers.get('set-cookie') ?? '';
      expect(setCookieHeader).toContain(REFRESH_TOKEN_COOKIE_NAME);
    });

    it('does not set the refresh token cookie when the backend omits it', async () => {
      const bodyWithoutRefresh = {
        ...backendSuccessBody,
        data: { ...backendSuccessBody.data, refreshToken: null },
      };
      fetchMock.mockResolvedValueOnce(makeBackendResponse(200, bodyWithoutRefresh));
      const POST = await importPOST();

      const response = await POST(makeRequest(validPayload));

      const setCookieHeader = response.headers.get('set-cookie') ?? '';
      expect(setCookieHeader).not.toContain(REFRESH_TOKEN_COOKIE_NAME);
    });

    it('returns 502 when the backend response has no access token', async () => {
      const bodyNoToken = {
        success: true,
        data: { accessToken: null, refreshToken: null, user: null },
      };
      fetchMock.mockResolvedValueOnce(makeBackendResponse(200, bodyNoToken));
      const POST = await importPOST();

      const response = await POST(makeRequest(validPayload));

      expect(response.status).toBe(502);
    });
  });

  describe('backend error responses', () => {
    beforeEach(() => {
      process.env.AUTH_API_BASE_URL = 'http://backend:3000/api/v1';
    });

    it('forwards the backend status code on failure', async () => {
      fetchMock.mockResolvedValueOnce(
        makeBackendResponse(401, { message: 'Credenciales inválidas.' }, false),
      );
      const POST = await importPOST();

      const response = await POST(makeRequest(validPayload));

      expect(response.status).toBe(401);
    });

    it('includes the backend error message in the response body', async () => {
      const errorMessage = 'Credenciales inválidas.';
      fetchMock.mockResolvedValueOnce(
        makeBackendResponse(401, { message: errorMessage }, false),
      );
      const POST = await importPOST();

      const response = await POST(makeRequest(validPayload));
      const body = await response.json() as { message: string };

      expect(body.message).toBe(errorMessage);
    });

    it('falls back to a default message when the backend body has no message', async () => {
      fetchMock.mockResolvedValueOnce(makeBackendResponse(401, null, false));
      const POST = await importPOST();

      const response = await POST(makeRequest(validPayload));
      const body = await response.json() as { message: string };

      expect(body.message).toBeTruthy();
    });
  });

  describe('network errors', () => {
    beforeEach(() => {
      process.env.AUTH_API_BASE_URL = 'http://backend:3000/api/v1';
    });

    it('returns 503 when fetch throws a network error', async () => {
      fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));
      const POST = await importPOST();

      const response = await POST(makeRequest(validPayload));

      expect(response.status).toBe(503);
    });
  });
});
