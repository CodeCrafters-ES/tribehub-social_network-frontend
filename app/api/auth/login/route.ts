import { NextResponse } from 'next/server';

import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_MAX_AGE_SECONDS,
} from '@/features/auth/constants';
import type { BackendAuthResponse, LoginPayload } from '@/features/auth/types';

// Nota: el logout debe limpiar ambas cookies: SESSION_COOKIE_NAME y
// REFRESH_TOKEN_COOKIE_NAME. Ver app/api/auth/logout/route.ts cuando se implemente.

function getBackendBaseUrl(): string {
  return process.env.AUTH_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
}

function isValidPayload(payload: unknown): payload is LoginPayload {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const candidate = payload as Partial<LoginPayload>;

  return (
    typeof candidate.email === 'string' &&
    candidate.email.length > 0 &&
    typeof candidate.password === 'string' &&
    candidate.password.length > 0
  );
}

export async function POST(request: Request) {
  const baseUrl = getBackendBaseUrl();
  if (!baseUrl) {
    return NextResponse.json(
      { message: 'Configura AUTH_API_BASE_URL para habilitar autenticación.' },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => null);
  if (!isValidPayload(body)) {
    return NextResponse.json(
      { message: 'Payload inválido. Revisa email y contraseña.' },
      { status: 400 },
    );
  }

  try {
    const backendResponse = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
      cache: 'no-store',
    });

    const data = (await backendResponse.json().catch(() => null)) as
      | BackendAuthResponse
      | null;

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: data?.message ?? 'Credenciales inválidas.' },
        { status: backendResponse.status },
      );
    }

    const accessToken = data?.data?.accessToken;
    if (!accessToken) {
      return NextResponse.json(
        { message: 'Respuesta de autenticación inválida: falta access token.' },
        { status: 502 },
      );
    }

    const refreshToken = data?.data?.refreshToken ?? null;
    const isProduction = process.env.NODE_ENV === 'production';

    const response = NextResponse.json(
      { user: data?.data?.user ?? null, message: 'Login exitoso.' },
      { status: 200 },
    );

    // Cookie 1 — access token: vida corta, lax para permitir navegación normal.
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: accessToken,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    // Cookie 2 — refresh token: vida larga, strict para nunca enviarse en
    // navegación cross-site. Solo se setea si el backend devuelve un refresh
    // token (Supabase lo omite cuando el email no está confirmado).
    if (refreshToken !== null) {
      response.cookies.set({
        name: REFRESH_TOKEN_COOKIE_NAME,
        value: refreshToken,
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        path: '/',
        maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
      });
    }

    return response;
  } catch {
    return NextResponse.json(
      { message: 'Error de red al autenticar. Intenta nuevamente.' },
      { status: 503 },
    );
  }
}
