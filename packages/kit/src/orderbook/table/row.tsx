import type { OrderbookTableDirection } from '@krono/kit';
import { cn } from '@krono/ui/lib';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import {
  getClassName as getBarClassName,
  getStyles as getBarStyles,
  type OrderbookTableRowBarProps,
} from './row-bar';

export type OrderbookTableRowProps = ComponentPropsWithoutRef<'div'> & {
  children: ReactNode;
  direction?: OrderbookTableDirection;
  barProps?: OrderbookTableRowBarProps;
};

export function OrderbookTableRow({
  children,
  className,
  barProps = {},
  style,
  direction,
  ...props
}: OrderbookTableRowProps) {
  return (
    <div
      style={{
        ...getBarStyles(barProps),
        ...style,
      }}
      className={cn(
        'relative flex shrink-0 grow px-2 py-1 items-center',
        direction === 'ltr' ? 'md:flex-row-reverse' : 'md:flex-row',
        getBarClassName(barProps),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
