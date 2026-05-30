// Endpoint BFF para revalidación client-side de sesión activa.
// Previsto para uso desde hooks de cliente cuando se necesite verificar si el
// token sigue activo sin redirigir. El token se lee desde la cookie httpOnly
// gestionada por el servidor, por lo que el cliente nunca lo manipula directamente.
import { NextResponse } from 'next/server';

import { getSessionTokenFromCookies, isTokenValid } from '@/features/auth/server-session';

export async function GET() {
  const token = await getSessionTokenFromCookies();
  if (!token || !(await isTokenValid(token))) {
    return NextResponse.json({ message: 'No autenticado.' }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true }, { status: 200 });
}
