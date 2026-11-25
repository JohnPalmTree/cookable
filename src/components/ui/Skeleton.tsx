const bar = 'rounded bg-surface-2'

export function SkeletonCard() {
  return (
    <div
      aria-hidden="true"
      className="animate-pulse rounded-2xl border border-line bg-surface p-4 motion-reduce:animate-none"
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-surface-2" />
        <div>
          <div className={`mb-1.5 h-3.5 w-28 ${bar}`} />
          <div className={`h-3 w-16 ${bar}`} />
        </div>
      </div>
      <div className={`h-4 w-16 ${bar}`} />
    </div>
  )
}

export function SkeletonList({ count = 6 }: { count?: number }) {
  return (
    <div role="status" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <span className="sr-only">Loading…</span>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
