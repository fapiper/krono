import { cn } from '@krono/ui/lib';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-foreground/10', className)}
      {...props}
    />
  );
}

export { Skeleton };
