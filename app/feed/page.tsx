import { redirect } from 'next/navigation';

import { isAuthenticated } from '@/lib/auth/server-session';

export default async function FeedPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect('/login');
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="rounded-2xl border border-brand-border bg-brand-surface p-6 shadow-card">
        <h1 className="text-3xl font-semibold text-brand-textMain">Feed</h1>
        <p className="mt-2 text-brand-textMuted">
          Autenticación válida. Esta ruta ya está protegida.
        </p>
      </div>
    </main>
  );
}
