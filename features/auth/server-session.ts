import { cookies } from 'next/headers';

import { SESSION_COOKIE_NAME } from '@/features/auth/constants';

export async function getSessionTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function verifyJwtSignature(token: string, secret: string): Promise<boolean> {
  const [header, payload, signatureB64] = token.split('.');
  if (!header || !payload || !signatureB64) return false;
  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    );
    const sigBytes = Uint8Array.from(
      atob(signatureB64.replace(/-/g, '+').replace(/_/g, '/')),
      (c) => c.charCodeAt(0),
    );
    return crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(`${header}.${payload}`));
  } catch {
    return false;
  }
}

export async function isTokenValid(token: string): Promise<boolean> {
  const payload = decodeJwtPayload(token);
  if (!payload) return false;

  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== 'number' || payload.exp <= now) return false;

  const secret = process.env.SUPABASE_JWT_SECRET;
  if (secret) return verifyJwtSignature(token, secret);

  // SUPABASE_JWT_SECRET is not set — behavior depends on environment.
  // In production this is a misconfiguration: forged tokens would pass validation,
  // so we stop the application immediately with a clear message.
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      '[TribeHub] SUPABASE_JWT_SECRET is not set. ' +
        'JWT signature verification is disabled, which allows forged tokens. ' +
        'Set this environment variable before running in production.',
    );
  }

  // In development/test, signature verification is intentionally skipped to ease
  // local setup. A warning is emitted so the developer is aware of the limitation.
  console.warn(
    '[TribeHub] SUPABASE_JWT_SECRET is not set. ' +
      'JWT signature verification is disabled — tokens are only checked for structure and expiry. ' +
      'This is acceptable for local development but must not reach production.',
  );
  return true;
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getSessionTokenFromCookies();
  if (!token) return false;
  return isTokenValid(token);
}
