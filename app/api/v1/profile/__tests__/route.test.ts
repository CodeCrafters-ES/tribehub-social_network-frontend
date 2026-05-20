/**
 * @jest-environment node
 *
 * Unit tests for the BFF profile route: app/api/v1/profile/route.ts
 *
 * El route importa next/server que requiere las globals del Web Fetch API
 * (Request, Response, Headers). Disponible nativamente en Node 18+.
 *
 * NOTA: Los casos de autenticación (401 sin cookie) se prueban en tests de
 * integración E2E. Aquí testamos los casos de éxito y manejo de errores.
 */
import { SESSION_COOKIE_NAME } from '@/features/auth/constants';

// ---------------------------------------------------------------------------
// Mock global fetch — usado por el route para llamar al backend
// ---------------------------------------------------------------------------

const fetchMock = jest.fn();

beforeAll(() => {
  global.fetch = fetchMock;
});

beforeEach(() => {
  delete process.env.AUTH_API_BASE_URL;
});

afterEach(() => {
  fetchMock.mockReset();
  delete process.env.AUTH_API_BASE_URL;
});

// ---------------------------------------------------------------------------
// Mock de cookies — evitar problemas con el módulo de next/headers
// ---------------------------------------------------------------------------

const mockCookieStore = {
  get: jest.fn(),
};

// Mockear el módulo completo de next/headers
jest.mock('next/headers', () => ({
  cookies: () => mockCookieStore,
}));

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

// Import dinámico del route handler
async function importGET() {
  jest.resetModules();
  const mod = await import('../route');
  return mod.GET;
}

async function importPATCH() {
  jest.resetModules();
  const mod = await import('../route');
  return mod.PATCH;
}

// ---------------------------------------------------------------------------
// Tests: GET /api/v1/profile
// ---------------------------------------------------------------------------

describe('GET /api/v1/profile', () => {
  beforeEach(() => {
    mockCookieStore.get.mockReturnValue({
      value: 'mock-jwt-token',
      name: SESSION_COOKIE_NAME,
    });
  });

  it('debe retornar datos del perfil cuando la cookie existe', async () => {
    const mockProfile = {
      id: 'uuid-1',
      userId: 'user-uuid',
      displayName: 'Test User',
      bio: 'Hola mundo',
      avatarUrl: 'https://example.com/avatar.jpg',
    };

    fetchMock.mockResolvedValueOnce(makeBackendResponse(200, mockProfile));

    const handler = await importGET();
    const response = await handler();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockProfile);
  });

  it('debe propagar errores 500 del backend', async () => {
    fetchMock.mockResolvedValueOnce(makeBackendResponse(500, { message: 'Internal error' }));

    const handler = await importGET();
    const response = await handler();

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.message).toBe('Error fetching profile');
  });

  it('debe propagar errores 404 del backend', async () => {
    fetchMock.mockResolvedValueOnce(makeBackendResponse(404, { message: 'Not found' }));

    const handler = await importGET();
    const response = await handler();

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.message).toBe('Error fetching profile');
  });

  it('debe manejar respuesta inválida del backend (no JSON)', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.reject(new Error('Invalid JSON')),
    } as unknown as Response);

    const handler = await importGET();
    const response = await handler();

    expect(response.status).toBe(502);
    const data = await response.json();
    expect(data.message).toBe('Invalid response from backend');
  });

  it('debe manejar error de red', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network error'));

    const handler = await importGET();
    const response = await handler();

    expect(response.status).toBe(503);
    const data = await response.json();
    expect(data.message).toBe('Network error fetching profile');
  });
});

// ---------------------------------------------------------------------------
// Tests: PATCH /api/v1/profile
// ---------------------------------------------------------------------------

describe('PATCH /api/v1/profile', () => {
  beforeEach(() => {
    mockCookieStore.get.mockReturnValue({
      value: 'mock-jwt-token',
      name: SESSION_COOKIE_NAME,
    });
  });

  it('debe retornar 400 si el payload es inválido', async () => {
    const handler = await importPATCH();
    // Request con json() que lanza error
    const badRequest = {
      json: () => Promise.reject(new Error('Invalid JSON')),
    } as unknown as Request;

    const response = await handler(badRequest);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.message).toBe('Invalid payload');
  });

  it('debe actualizar el perfil exitosamente', async () => {
    const updatedProfile = {
      id: 'uuid-1',
      userId: 'user-uuid',
      displayName: 'Nuevo Nombre',
    };

    fetchMock.mockResolvedValueOnce(makeBackendResponse(200, updatedProfile));

    const handler = await importPATCH();
    const request = {
      json: () => Promise.resolve({ displayName: 'Nuevo Nombre' }),
    } as unknown as Request;

    const response = await handler(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(updatedProfile);
  });

  it('debe propagar errores 400 del backend', async () => {
    fetchMock.mockResolvedValueOnce(
      makeBackendResponse(400, { message: 'Validation error' }),
    );

    const handler = await importPATCH();
    const request = {
      json: () => Promise.resolve({ displayName: 'Test' }),
    } as unknown as Request;

    const response = await handler(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.message).toBe('Error updating profile');
  });

  it('debe manejar error de red', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network error'));

    const handler = await importPATCH();
    const request = {
      json: () => Promise.resolve({ displayName: 'Test' }),
    } as unknown as Request;

    const response = await handler(request);

    expect(response.status).toBe(503);
    const data = await response.json();
    expect(data.message).toBe('Network error updating profile');
  });

  it('debe manejar respuesta inválida del backend', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.reject(new Error('Invalid JSON')),
    } as unknown as Response);

    const handler = await importPATCH();
    const request = {
      json: () => Promise.resolve({ displayName: 'Test' }),
    } as unknown as Request;

    const response = await handler(request);

    expect(response.status).toBe(502);
    const data = await response.json();
    expect(data.message).toBe('Invalid response from backend');
  });
});