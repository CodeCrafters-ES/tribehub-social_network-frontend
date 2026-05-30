import { NextResponse } from 'next/server';

import { getSessionTokenFromCookies, isTokenValid } from '@/features/auth/server-session';

export async function GET() {
  const token = await getSessionTokenFromCookies();
  if (!token || !(await isTokenValid(token))) {
    return NextResponse.json({ message: 'No autenticado.' }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true }, { status: 200 });
}
