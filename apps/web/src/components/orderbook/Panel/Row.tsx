import type { PriceLevel } from '@krono/sdk/core';
import { cn } from '@ui/lib';
import type { HTMLAttributes, ReactNode } from 'react';

export type OrderbookPanelRowProps = HTMLAttributes<HTMLDivElement> & {
  cells?: [ReactNode, ReactNode, ReactNode];
};

export function OrderbookPanelRow({
  className,
  cells,
  ...props
}: OrderbookPanelRowProps) {
  return (
    <div className={cn('grid grid-cols-3', className)} {...props}>
      <span className={'p-0.5'}>{cells?.[0]}</span>
      <span className={'p-0.5'}> {cells?.[1]}</span>
      <span className={'p-0.5'}> {cells?.[2]}</span>
    </div>
  );
}
