import { SESSION_COOKIE_NAME } from '@/features/auth/constants';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

import { cookies } from 'next/headers';
import { isAuthenticated, isTokenValid } from '@/features/auth/server-session';

// ---------------------------------------------------------------------------
// Web API shims required for server-side modules running in jsdom
// jsdom does not expose TextEncoder or crypto.subtle.
// ---------------------------------------------------------------------------

import { TextEncoder as NodeTextEncoder } from 'util';

if (typeof globalThis.TextEncoder === 'undefined') {
  (globalThis as unknown as Record<string, unknown>).TextEncoder = NodeTextEncoder;
}

const subtleStub = {
  importKey: jest.fn(),
  verify: jest.fn(),
};

Object.defineProperty(globalThis, 'crypto', {
  configurable: true,
  value: { subtle: subtleStub },
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Builds a JWT-shaped string without any external library.
 * The default signature is a valid base64url-encoded byte sequence so that
 * atob() inside verifyJwtSignature does not throw before the mock is reached.
 */
function makeJwt(payload: Record<string, unknown>, signatureOverride?: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  const body = btoa(JSON.stringify(payload))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  // 'AAAA' decodes to three null bytes — valid base64url, harmless fake sig.
  const sig = signatureOverride ?? 'AAAA';
  return `${header}.${body}.${sig}`;
}

function futureExp(offsetSeconds = 3600): number {
  return Math.floor(Date.now() / 1000) + offsetSeconds;
}

function pastExp(offsetSeconds = 3600): number {
  return Math.floor(Date.now() / 1000) - offsetSeconds;
}

function mockCookieWithToken(token: string | null) {
  (cookies as jest.Mock).mockResolvedValue({
    get: (name: string) =>
      name === SESSION_COOKIE_NAME && token !== null ? { value: token } : undefined,
  });
}

// ---------------------------------------------------------------------------
// isTokenValid()
// ---------------------------------------------------------------------------

describe('isTokenValid()', () => {
  const originalSecret = process.env.SUPABASE_JWT_SECRET;

  afterEach(() => {
    if (originalSecret === undefined) {
      delete process.env.SUPABASE_JWT_SECRET;
    } else {
      process.env.SUPABASE_JWT_SECRET = originalSecret;
    }
    jest.clearAllMocks();
  });

  it('returns false for a malformed token (no dots)', async () => {
    const result = await isTokenValid('notavalidtoken');
    expect(result).toBe(false);
  });

  it('returns false for a token with an expired exp', async () => {
    delete process.env.SUPABASE_JWT_SECRET;
    const token = makeJwt({ exp: pastExp() });
    const result = await isTokenValid(token);
    expect(result).toBe(false);
  });

  it('returns false for a token with no exp claim', async () => {
    delete process.env.SUPABASE_JWT_SECRET;
    const token = makeJwt({ sub: 'user-id' });
    const result = await isTokenValid(token);
    expect(result).toBe(false);
  });

  it('returns true for a valid token when SUPABASE_JWT_SECRET is not set', async () => {
    delete process.env.SUPABASE_JWT_SECRET;
    const token = makeJwt({ exp: futureExp() });
    const result = await isTokenValid(token);
    expect(result).toBe(true);
  });

  it('returns false when SUPABASE_JWT_SECRET is set and signature verification fails', async () => {
    process.env.SUPABASE_JWT_SECRET = 'test-secret';
    subtleStub.importKey.mockResolvedValueOnce({} as CryptoKey);
    subtleStub.verify.mockResolvedValueOnce(false);

    const token = makeJwt({ exp: futureExp() });
    const result = await isTokenValid(token);
    expect(result).toBe(false);
  });

  it('returns true when SUPABASE_JWT_SECRET is set and signature verification passes', async () => {
    process.env.SUPABASE_JWT_SECRET = 'test-secret';
    subtleStub.importKey.mockResolvedValueOnce({} as CryptoKey);
    subtleStub.verify.mockResolvedValueOnce(true);

    const token = makeJwt({ exp: futureExp() });
    const result = await isTokenValid(token);
    expect(result).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// isAuthenticated()
// ---------------------------------------------------------------------------

describe('isAuthenticated()', () => {
  const originalSecret = process.env.SUPABASE_JWT_SECRET;

  afterEach(() => {
    if (originalSecret === undefined) {
      delete process.env.SUPABASE_JWT_SECRET;
    } else {
      process.env.SUPABASE_JWT_SECRET = originalSecret;
    }
    jest.clearAllMocks();
  });

  it('returns false when there is no cookie', async () => {
    mockCookieWithToken(null);
    const result = await isAuthenticated();
    expect(result).toBe(false);
  });

  it('returns false for a malformed token (one part, no dots)', async () => {
    mockCookieWithToken('malformed');
    const result = await isAuthenticated();
    expect(result).toBe(false);
  });

  it('returns false for a token with exp in the past', async () => {
    delete process.env.SUPABASE_JWT_SECRET;
    const token = makeJwt({ exp: pastExp() });
    mockCookieWithToken(token);
    const result = await isAuthenticated();
    expect(result).toBe(false);
  });

  it('returns true for a token with exp in the future when SUPABASE_JWT_SECRET is not set', async () => {
    delete process.env.SUPABASE_JWT_SECRET;
    const token = makeJwt({ exp: futureExp() });
    mockCookieWithToken(token);
    const result = await isAuthenticated();
    expect(result).toBe(true);
  });

  it('returns false when SUPABASE_JWT_SECRET is set and signature verification fails', async () => {
    process.env.SUPABASE_JWT_SECRET = 'test-secret';
    subtleStub.importKey.mockResolvedValueOnce({} as CryptoKey);
    subtleStub.verify.mockResolvedValueOnce(false);

    const token = makeJwt({ exp: futureExp() });
    mockCookieWithToken(token);
    const result = await isAuthenticated();
    expect(result).toBe(false);
  });

  it('returns true when SUPABASE_JWT_SECRET is set and signature verification passes', async () => {
    process.env.SUPABASE_JWT_SECRET = 'test-secret';
    subtleStub.importKey.mockResolvedValueOnce({} as CryptoKey);
    subtleStub.verify.mockResolvedValueOnce(true);

    const token = makeJwt({ exp: futureExp() });
    mockCookieWithToken(token);
    const result = await isAuthenticated();
    expect(result).toBe(true);
  });
});
