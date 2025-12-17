'use client';

import { OrderbookTableRow } from './row';
import type { OrderbookTableBaseProps, PriceLevelDataProps } from './types';

export type OrderbookTableChartProps = PriceLevelDataProps &
  OrderbookTableBaseProps;

export function OrderbookTableChart({
  className,
  children,
  ...props
}: OrderbookTableChartProps) {
  return (
    <OrderbookTableRow className={className} {...props}>
      {children}
    </OrderbookTableRow>
  );
}
