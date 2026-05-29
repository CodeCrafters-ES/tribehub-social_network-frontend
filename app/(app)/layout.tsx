/**
 * Layout de la zona autenticada de la aplicación.
 *
 * Este layout protege todas las rutas dentro de (app) verificando
 * que el usuario esté autenticado. Si no lo está, redirige a /login.
 *
 * Arquitectura FSD: (app) es la zona autenticada.
 */
import { RedirectType, redirect } from 'next/navigation';
import { isAuthenticated } from '@/features/auth/server-session';

export default async function AppLayout({
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