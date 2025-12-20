import { cn } from '@krono/ui/lib';
import type { ComponentPropsWithoutRef } from 'react';
import { OrderbookControlsRootProvider } from './root-provider';

export type OrderbookControlsRootProps = ComponentPropsWithoutRef<'div'>;

export function OrderbookControlsRoot({
  className,
  children,
  ...props
}: OrderbookControlsRootProps) {
  return (
    <OrderbookControlsRootProvider>
      <div className={cn('relative group', className)} {...props}>
        {children}
      </div>
    </OrderbookControlsRootProvider>
  );
}
