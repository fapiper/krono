import { cn } from '@krono/ui/lib';
import type { ComponentPropsWithoutRef } from 'react';

export type OrderbookTableColumnProps = ComponentPropsWithoutRef<'div'>;

export function OrderbookTableColumn({
  children,
  className,
  ...props
}: OrderbookTableColumnProps) {
  return (
    <div
      className={cn('flex flex-col flex-1 w-full gap-y-px', className)}
      {...props}
    >
      {children}
    </div>
  );
}
