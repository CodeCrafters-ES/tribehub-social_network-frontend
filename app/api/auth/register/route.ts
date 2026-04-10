import { NextResponse } from 'next/server';

import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from '@/features/auth/constants';
import type { BackendAuthResponse, RegisterPayload } from '@/features/auth/types';

function getBackendBaseUrl(): string {
  return process.env.AUTH_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
}

function isValidPayload(payload: unknown): payload is RegisterPayload {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const candidate = payload as Partial<RegisterPayload>;

  return (
    typeof candidate.username === 'string' &&
    candidate.username.trim().length > 0 &&
    !candidate.username.includes(' ') &&
    typeof candidate.email === 'string' &&
    candidate.email.length > 0 &&
    typeof candidate.password === 'string' &&
    candidate.password.length >= 8
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
      { message: 'Payload inválido. Revisa nombre, email y contraseña.' },
      { status: 400 },
    );
  }

  try {
    const backendResponse = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: body.username.trim(),
        email: body.email.trim().toLowerCase(),
        password: body.password,
      }),
      cache: 'no-store',
    });

    const data = (await backendResponse.json().catch(() => null)) as
      | BackendAuthResponse
      | null;

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: data?.message ?? 'No fue posible completar el registro.' },
        { status: backendResponse.status },
      );
    }

    const token = data?.data?.accessToken ?? null;
    const hasSession = Boolean(token);

    const response = NextResponse.json(
      {
        user: data?.data?.user ?? null,
        hasSession,
        message: 'Registro exitoso.',
      },
      { status: 201 },
    );

    if (token) {
      response.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_MAX_AGE_SECONDS,
      });
    }

    return response;
  } catch {
    return NextResponse.json(
      { message: 'Error de red al registrar. Intenta nuevamente.' },
      { status: 503 },
    );
  }
}
