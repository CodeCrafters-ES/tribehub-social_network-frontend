'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function RootError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error('[RootError]', error);
  }, [error]);

  return (
    <div className="grid min-h-screen place-items-center px-6 py-8">
      <div className="w-full max-w-[480px] space-y-6 rounded-2xl border border-brand-border bg-brand-surface p-8 shadow-card text-center">
        <div
          aria-hidden="true"
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 border border-red-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-brand-danger"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold text-brand-textMain">
            Algo salió mal
          </h1>
          <p className="text-sm text-brand-textMuted">
            Ocurrió un error inesperado en la aplicación. Puedes intentarlo de
            nuevo o recargar la página.
          </p>
        </div>

        {error.digest && (
          <p className="text-xs text-brand-textMuted opacity-60">
            Código de referencia:{' '}
            <span className="font-mono">{error.digest}</span>
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="rounded-xl bg-brand-accent px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-accentHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="rounded-xl border border-brand-border px-6 py-2.5 text-sm font-semibold text-brand-textMain transition hover:bg-brand-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
