'use client';

import { useEffect } from 'react';

import Button from '@/shared/ui/Button';

export default function ErrorBoundary({
  reset,
  error,
}: {
  reset: () => void;
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Log the error for debugging purposes
    console.error('Onboarding Profile Error:', error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[420px] space-y-6 text-center">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold leading-tight text-brand-textMain">
            Algo salió mal
          </h1>
          <p className="mt-1 text-sm text-brand-textMuted">
            No pudimos cargar la página de perfil. Por favor, intenta
            nuevamente.
          </p>
        </div>

        <Button onClick={() => reset()}>Intentar nuevamente</Button>

        <p className="mt-2 text-xs text-brand-textMuted">
          Si el problema persiste, contacta al soporte.
        </p>
      </div>
    </div>
  );
}