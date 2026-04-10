/**
 * BFF — POST /api/auth/refresh
 *
 * Intermediario entre el cliente y el backend NestJS para la rotación de
 * refresh tokens. El interceptor de Axios en services/api/axios.ts llama a
 * este endpoint cuando recibe un 401 en cualquier petición autenticada.
 *
 * ACOPLAMIENTO IMPORTANTE:
 * El interceptor de Axios usa `axiosInstance.post('/auth/refresh')` donde
 * baseURL = NEXT_PUBLIC_API_BASE_URL. Para que el interceptor llegue a este
 * BFF en lugar del backend directo, NEXT_PUBLIC_API_BASE_URL debe apuntar al
 * propio servidor Next.js (p.ej. http://localhost:3001/api/v1 en desarrollo,
 * o la URL pública de Netlify en producción) con rewrites en next.config.ts
 * que proxeen /api/v1/* → backend NestJS.
 *
 * Flujo:
 *   1. Lee la cookie httpOnly `tribehub_refresh` del request entrante.
 *   2. La reenvía al backend NestJS como cookie `refresh_token` via POST /auth/refresh.
 *   3. Si el backend rota el token, actualiza ambas cookies en el cliente.
 *   4. Devuelve 200 con el nuevo accessToken para que el interceptor no
 *      necesite releerlo (las cookies se propagan automáticamente).
 *   5. Si el backend responde 401/403, devuelve 401 para que el interceptor
 *      redirija a /login.
 */
import { NextRequest, NextResponse } from 'next/server';

import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_MAX_AGE_SECONDS,
} from '@/features/auth/constants';
import type { BackendAuthResponse } from '@/features/auth/types';

/** Nombre de la cookie que el backend NestJS espera leer. */
const BACKEND_REFRESH_COOKIE = 'refresh_token';

function getBackendBaseUrl(): string {
  return process.env.AUTH_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
}

export async function POST(request: NextRequest) {
  const baseUrl = getBackendBaseUrl();
  if (!baseUrl) {
    return NextResponse.json(
      { message: 'Configura AUTH_API_BASE_URL para habilitar autenticación.' },
      { status: 500 },
    );
  }

  // Leer el refresh token de la cookie httpOnly del cliente.
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value;

  if (!refreshToken) {
    // No hay refresh token — la sesión expiró por completo.
    return NextResponse.json(
      { message: 'Sesión expirada. Vuelve a iniciar sesión.' },
      { status: 401 },
    );
  }

  try {
    // Reenviar al backend NestJS con el nombre de cookie que éste espera.
    const backendResponse = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        Cookie: `${BACKEND_REFRESH_COOKIE}=${encodeURIComponent(refreshToken)}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    // Si el backend rechaza el refresh token, limpiar cookies y devolver 401.
    if (backendResponse.status === 401 || backendResponse.status === 403) {
      const expired = NextResponse.json(
        { message: 'Sesión inválida o expirada. Vuelve a iniciar sesión.' },
        { status: 401 },
      );
      // Borrar ambas cookies del cliente.
      expired.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: '',
        httpOnly: true,
        maxAge: 0,
        path: '/',
      });
      expired.cookies.set({
        name: REFRESH_TOKEN_COOKIE_NAME,
        value: '',
        httpOnly: true,
        maxAge: 0,
        path: '/',
      });
      return expired;
    }

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: 'Error al renovar la sesión. Intenta nuevamente.' },
        { status: 502 },
      );
    }

    const data = (await backendResponse.json().catch(() => null)) as BackendAuthResponse | null;

    const newAccessToken = data?.data?.accessToken;
    if (!newAccessToken) {
      return NextResponse.json(
        { message: 'Respuesta de refresco inválida: falta access token.' },
        { status: 502 },
      );
    }

    const newRefreshToken = data?.data?.refreshToken ?? null;
    const isProduction = process.env.NODE_ENV === 'production';

    const response = NextResponse.json(
      { message: 'Token renovado correctamente.' },
      { status: 200 },
    );

    // Actualizar cookie del access token.
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: newAccessToken,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    // Actualizar cookie del refresh token si el backend devuelve uno nuevo
    // (rotación completa). Si no devuelve uno nuevo, la cookie existente
    // sigue siendo válida hasta su expiración natural.
    if (newRefreshToken !== null) {
      response.cookies.set({
        name: REFRESH_TOKEN_COOKIE_NAME,
        value: newRefreshToken,
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
      { message: 'Error de red al renovar la sesión. Intenta nuevamente.' },
      { status: 503 },
    );
  }
}
