import { cn } from '@krono/ui/lib';
import type { ComponentPropsWithoutRef } from 'react';

export type OrderbookTableCellProps = ComponentPropsWithoutRef<'div'>;

export function OrderbookTableCell({
  children,
  className,
  ...props
}: OrderbookTableCellProps) {
  return (
    <div className={cn('tabular-nums', className)} {...props}>
      {children}
    </div>
  );
}
