import type { PriceLevel } from '@krono/sdk/core';
import { cn } from '@ui/lib';
import type { HTMLAttributes } from 'react';

export type OrderbookPanelColumnProps = HTMLAttributes<HTMLDivElement>;

export function OrderbookPanelColumn({
  className,
  ...props
}: OrderbookPanelColumnProps) {
  return <div className={cn('', className)} {...props} />;
}
