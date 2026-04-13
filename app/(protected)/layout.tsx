import { RedirectType, redirect } from 'next/navigation';
import { isAuthenticated } from '@/features/auth/server-session';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    // Redirect to login if not authenticated
    redirect('/login', RedirectType.replace);
  }

  return <>{children}</>;
}
