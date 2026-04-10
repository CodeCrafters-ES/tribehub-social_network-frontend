import { NextResponse } from 'next/server';

import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from '@/features/auth/constants';
import type { BackendAuthResponse, LoginPayload } from '@/features/auth/types';

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

    const token = data?.data?.accessToken;
    if (!token) {
      return NextResponse.json(
        { message: 'Respuesta de autenticación inválida: falta token.' },
        { status: 502 },
      );
    }

    const response = NextResponse.json(
      { user: data?.data?.user ?? null, message: 'Login exitoso.' },
      { status: 200 },
    );

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: 'Error de red al autenticar. Intenta nuevamente.' },
      { status: 503 },
    );
  }
}
