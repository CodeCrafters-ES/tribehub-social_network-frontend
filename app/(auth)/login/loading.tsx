export default function LoginLoading() {
  return (
    <div className="grid min-h-screen place-items-center px-6 py-8">
      <div className="w-full max-w-[420px] space-y-4 rounded-2xl border border-brand-border bg-brand-surface p-7 shadow-card">
        {/* Encabezado skeleton */}
        <div className="space-y-2">
          <div className="h-8 w-3/4 animate-pulse rounded-lg bg-brand-border" />
          <div className="h-4 w-full animate-pulse rounded-lg bg-brand-border" />
        </div>

        {/* Campo email skeleton */}
        <div className="space-y-1.5">
          <div className="h-4 w-12 animate-pulse rounded bg-brand-border" />
          <div className="h-10 w-full animate-pulse rounded-xl bg-brand-border" />
        </div>

        {/* Campo contraseña skeleton */}
        <div className="space-y-1.5">
          <div className="h-4 w-24 animate-pulse rounded bg-brand-border" />
          <div className="h-10 w-full animate-pulse rounded-xl bg-brand-border" />
        </div>

        {/* Botón skeleton */}
        <div className="h-11 w-full animate-pulse rounded-xl bg-brand-border" />

        {/* Enlace skeleton */}
        <div className="mx-auto h-4 w-48 animate-pulse rounded bg-brand-border" />
      </div>
    </div>
  );
}
