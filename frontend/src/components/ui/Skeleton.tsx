export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-slate-200 ${className}`} />;
}

export function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-lg border border-app-border bg-white p-5 shadow-soft">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="mt-3 h-4 w-1/3" />
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton className="mt-3 h-4 w-full" key={index} />
      ))}
    </div>
  );
}
