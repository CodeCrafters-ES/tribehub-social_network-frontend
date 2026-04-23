export default function FeedLoading() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="space-y-4">
        {/* Encabezado skeleton */}
        <div className="h-9 w-24 animate-pulse rounded-lg bg-brand-border" />

        {/* Tarjetas de post skeleton */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-brand-border bg-brand-surface p-5 shadow-card space-y-3"
          >
            {/* Autor row */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-full bg-brand-border" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-32 animate-pulse rounded bg-brand-border" />
                <div className="h-3 w-20 animate-pulse rounded bg-brand-border" />
              </div>
            </div>

            {/* Cuerpo del post */}
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-brand-border" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-brand-border" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-brand-border" />
            </div>

            {/* Barra de acciones */}
            <div className="flex gap-4 pt-1">
              <div className="h-5 w-14 animate-pulse rounded bg-brand-border" />
              <div className="h-5 w-20 animate-pulse rounded bg-brand-border" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
