import { cn } from '@krono/ui/lib';
import type { ComponentPropsWithoutRef } from 'react';

export type OrderbookTableCellProps = ComponentPropsWithoutRef<'div'>;

export function OrderbookTableCell({
  children,
  className,
  ...props
}: OrderbookTableCellProps) {
  return (
    <div className={cn('relative tabular-nums flex-1', className)} {...props}>
      {children}
    </div>
  );
}
