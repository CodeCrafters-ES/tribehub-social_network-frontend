/**
 * Profile API route — valida sesión del servidor y reenvía al backend.
 *
 * El backend espera Authorization: Bearer <JWT> pero el frontend usa cookie.
 * Este handler:
 * 1. Lee la cookie tribehub_session del request
 * 2. La envía como Authorization: Bearer al backend
 * 3. Reenvía la respuesta
 */
import { NextResponse } from 'next/server';

import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME } from '@/features/auth/constants';

function getBackendBaseUrl(): string {
  return process.env.AUTH_API_BASE_URL ?? 'http://localhost:3000/api/v1';
}

export async function GET() {
  const backendUrl = getBackendBaseUrl();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!accessToken) {
    return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
  }

  try {
    const response = await fetch(`${backendUrl}/profile/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      // Include backend error message for debugging
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: 'Unknown error' };
      }
      return NextResponse.json(
        {
          message: 'Error fetching profile',
          backendError: errorData,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { message: 'Network error fetching profile' },
      { status: 503 },
    );
  }
}

export async function PATCH(request: Request) {
  const backendUrl = getBackendBaseUrl();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!accessToken) {
    return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  }

  try {
    const response = await fetch(`${backendUrl}/profile/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Include backend error message for debugging
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: 'Unknown error' };
      }
      return NextResponse.json(
        {
          message: 'Error updating profile',
          backendError: errorData,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: 'Network error updating profile' },
      { status: 503 },
    );
  }
}
