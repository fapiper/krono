import { cn } from '@krono/ui/lib';
import type { ComponentPropsWithoutRef } from 'react';
import { OrderbookTable } from './table';

export type OrderbookPanelSkeletonProps = ComponentPropsWithoutRef<'div'> & {
  rows?: number;
};

export function OrderbookPanelSkeleton({
  rows,
  className,
  children,
  ...props
}: OrderbookPanelSkeletonProps) {
  return (
    <>
      <OrderbookTable.Skeleton rows={rows} />
      <OrderbookTable.Skeleton rows={rows} />
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center bg-background/25 z-10',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </>
  );
}
