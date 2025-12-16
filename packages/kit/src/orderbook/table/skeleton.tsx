import { Skeleton } from '@ui/components/ui/skeleton';

export function OrderbookTableSkeleton({ n }: { n: number }) {
  const rows = Array.from({ length: n }).map((_, i) => `skeleton-${i}`);

  return (
    <div
      className={
        'w-full flex flex-col grow shrink-0 overflow-hidden gap-1 pb-1'
      }
    >
      <div className="grid grid-cols-3 grow shrink-0 py-1">
        <Skeleton className="w-24" />
        <Skeleton className="w-32" />
        <Skeleton className="w-24" />
      </div>

      {rows.map((key, i) => (
        <div
          key={key}
          className="grid grid-cols-3 grow shrink-0 py-0 relative w-full gap-1"
        >
          <Skeleton className="w-full" />
          <Skeleton className="w-full" />
          <Skeleton className="w-full" />
        </div>
      ))}
    </div>
  );
}
