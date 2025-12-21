import { cn } from '@krono/ui/lib';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import {
  getClassName as getBarClassName,
  getStyles as getBarStyles,
  type OrderbookTableRowBarProps,
} from './row-bar';

export type OrderbookTableRowProps = ComponentPropsWithoutRef<'div'> & {
  children: ReactNode;
  barProps?: OrderbookTableRowBarProps;
};

export function OrderbookTableRow({
  children,
  className,
  barProps = {},
  style,
  ...props
}: OrderbookTableRowProps) {
  return (
    <div
      style={{
        ...getBarStyles(barProps),
        ...style,
      }}
      className={cn(
        'relative grid shrink-0 grow px-2 py-0.5 items-center',
        getBarClassName(barProps),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
