import { login, LoginError } from '@/features/auth/client';

// ---------------------------------------------------------------------------
// Mock global fetch
// ---------------------------------------------------------------------------

const fetchMock = jest.fn();

beforeAll(() => {
  global.fetch = fetchMock;
});

afterEach(() => {
  fetchMock.mockReset();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeResponse(
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

const payload = { email: 'user@example.com', password: 'secret123' };

const successBody = {
  user: { id: 'u1', email: 'user@example.com' },
  message: 'Login exitoso.',
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('login() in features/auth/client.ts', () => {
  describe('request shape', () => {
    it('calls the BFF endpoint POST /api/auth/login', async () => {
      fetchMock.mockResolvedValueOnce(makeResponse(200, successBody));

      await login(payload);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(url).toBe('/api/auth/login');
    });

    it('uses the POST method', async () => {
      fetchMock.mockResolvedValueOnce(makeResponse(200, successBody));

      await login(payload);

      const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(options.method).toBe('POST');
    });

    it('sends Content-Type application/json', async () => {
      fetchMock.mockResolvedValueOnce(makeResponse(200, successBody));

      await login(payload);

      const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
      const headers = options.headers as Record<string, string>;
      expect(headers['Content-Type']).toBe('application/json');
    });

    it('encodes email and password in the JSON body', async () => {
      fetchMock.mockResolvedValueOnce(makeResponse(200, successBody));

      await login(payload);

      const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
      const body = JSON.parse(options.body as string) as Record<string, string>;
      expect(body.email).toBe(payload.email);
      expect(body.password).toBe(payload.password);
    });
  });

  describe('success path', () => {
    it('returns the user from the response body', async () => {
      fetchMock.mockResolvedValueOnce(makeResponse(200, successBody));

      const result = await login(payload);

      expect(result.user).toEqual(successBody.user);
    });

    it('returns user as null when the body omits the user field', async () => {
      fetchMock.mockResolvedValueOnce(makeResponse(200, { message: 'ok' }));

      const result = await login(payload);

      expect(result.user).toBeNull();
    });
  });

  describe('error path', () => {
    it('throws LoginError on a 401 response', async () => {
      fetchMock.mockResolvedValueOnce(
        makeResponse(401, { message: 'Credenciales inválidas.' }, false),
      );

      await expect(login(payload)).rejects.toThrow(LoginError);
    });

    it('throws LoginError on a 500 response', async () => {
      fetchMock.mockResolvedValueOnce(
        makeResponse(500, { message: 'Internal server error.' }, false),
      );

      await expect(login(payload)).rejects.toThrow(LoginError);
    });

    it('uses the message from the response body in the thrown error', async () => {
      const errorMessage = 'Credenciales inválidas.';
      fetchMock.mockResolvedValueOnce(
        makeResponse(401, { message: errorMessage }, false),
      );

      await expect(login(payload)).rejects.toThrow(errorMessage);
    });

    it('falls back to a default message when the error body has no message', async () => {
      fetchMock.mockResolvedValueOnce(makeResponse(401, null, false));

      await expect(login(payload)).rejects.toThrow(
        'No fue posible iniciar sesión.',
      );
    });

    it('throws LoginError when json() fails on an error response', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 503,
        json: () => Promise.reject(new SyntaxError('Unexpected token')),
      } as unknown as Response);

      await expect(login(payload)).rejects.toThrow(LoginError);
    });
  });
});
