import { cookies } from 'next/headers';

import { SESSION_COOKIE_NAME } from '@/features/auth/constants';

export async function getSessionTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getSessionTokenFromCookies();
  return Boolean(token);
}
