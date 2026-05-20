/**
 * Loading state para la ruta de perfil de onboarding.
 * Muestra un skeleton mientras se cargan los datos del perfil.
 */
export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[420px] space-y-6">
        <div className="space-y-4">
          {/* Skeleton del título */}
          <div className="h-9 w-48 animate-pulse rounded-md bg-brand-surface" />
          {/* Skeleton de la descripción */}
          <div className="h-4 w-72 animate-pulse rounded bg-brand-surface" />
        </div>

        <div className="space-y-4">
          {/* Skeleton del campo nombre */}
          <div className="space-y-2">
            <div className="h-5 w-32 animate-pulse rounded bg-brand-surface" />
            <div className="h-10 w-full animate-pulse rounded-md border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900" />
          </div>

          {/* Skeleton del campo bio */}
          <div className="space-y-2">
            <div className="h-5 w-16 animate-pulse rounded bg-brand-surface" />
            <div className="h-24 w-full animate-pulse rounded-md border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900" />
          </div>

          {/* Skeleton del campo avatar */}
          <div className="space-y-2">
            <div className="h-5 w-24 animate-pulse rounded bg-brand-surface" />
            <div className="h-10 w-full animate-pulse rounded-md border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900" />
          </div>

          {/* Skeleton del botón */}
          <div className="h-10 w-full animate-pulse rounded-md bg-brand-primary" />
        </div>
      </div>
    </div>
  );
}