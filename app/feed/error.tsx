'use client';

import { useEffect } from 'react';

export default function FeedError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error('[FeedError]', error);
  }, [error]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="rounded-2xl border border-brand-border bg-brand-surface p-8 shadow-card text-center space-y-5">
        <div
          aria-hidden="true"
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 border border-red-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-brand-danger"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-brand-textMain">
            No se pudo cargar el feed
          </h1>
          <p className="text-sm text-brand-textMuted">
            Hubo un problema al obtener las publicaciones. Comprueba tu conexión
            e inténtalo de nuevo.
          </p>
        </div>

        {error.digest && (
          <p className="text-xs text-brand-textMuted opacity-60">
            Código de referencia:{' '}
            <span className="font-mono">{error.digest}</span>
          </p>
        )}

        <button
          type="button"
          onClick={() => unstable_retry()}
          className="rounded-xl bg-brand-accent px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-accentHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
        >
          Intentar de nuevo
        </button>
      </div>
    </main>
  );
}
