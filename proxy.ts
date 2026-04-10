import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { SESSION_COOKIE_NAME } from '@/features/auth/constants';

/**
 * Routes that do not require an active session.
 * The root path `/` is intentionally public so unauthenticated users can land
 * on the marketing/splash page rather than being bounced to /login immediately.
 */
const PUBLIC_PATHS = new Set(['/login', '/register', '/']);

/**
 * Routes where an already-authenticated user should not linger.
 * Visiting /login or /register while logged in redirects to /feed.
 */
const AUTH_ONLY_PATHS = new Set(['/login', '/register']);

function isPublicPath(pathname: string): boolean {
  // Exact match against known public paths.
  return PUBLIC_PATHS.has(pathname);
}

function isAuthOnlyPath(pathname: string): boolean {
  return AUTH_ONLY_PATHS.has(pathname);
}

/**
 * TribeHub route proxy (Next.js 16 equivalent of middleware).
 *
 * Rules:
 *  1. Requests to static assets and internal API routes (/api/auth/*) pass
 *     through unconditionally — enforced via the matcher config below.
 *  2. Unauthenticated request to a protected route → redirect to /login,
 *     preserving the original path in the `next` query param.
 *  3. Authenticated request to /login or /register → redirect to /feed.
 *
 * JWT validation is intentionally omitted here: this file runs close to the
 * network edge and must stay lightweight. Real authorization (verifying the
 * token signature) happens server-side in each Server Component / Route Handler
 * via `lib/auth/server-session.ts`. This proxy is a first-pass UX guard only.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(
    request.cookies.get(SESSION_COOKIE_NAME)?.value,
  );

  // Rule 3: authenticated user on an auth-only page → send to feed.
  if (hasSession && isAuthOnlyPath(pathname)) {
    return NextResponse.redirect(new URL('/feed', request.url));
  }

  // Rule 2: unauthenticated user on a protected page → send to login.
  if (!hasSession && !isPublicPath(pathname)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  /*
   * Run on every path EXCEPT:
   *  - _next/static  → compiled assets
   *  - _next/image   → image optimisation endpoint
   *  - api/auth      → internal Next.js auth route handlers (login/register
   *                    actions need to be reachable without a session cookie)
   *  - favicon.ico, sitemap.xml, robots.txt → metadata files
   *  - image extensions → public static images
   *
   * Note: even when _next/data is absent from the negative lookahead, Next.js
   * still invokes proxy for those routes automatically to prevent accidental
   * security holes (documented behaviour in Next.js 16).
   */
  matcher: [
    '/((?!_next/static|_next/image|api/auth|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?)$).*)',
  ],
};
