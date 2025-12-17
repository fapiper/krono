import type { PriceLevel } from '@krono/core';
import type { useOrderbookPlayback } from '@krono/hooks';
import type { HTMLAttributes } from 'react';

export type OrderbookTableBaseProps = HTMLAttributes<HTMLDivElement>;

export interface PriceLevelDataProps {
  data: PriceLevel[];
  maxTotal: number;
  type?: 'bids' | 'asks';
}

export type OrderbookTableControlsProps = OrderbookTableBaseProps & {
  controls: ReturnType<typeof useOrderbookPlayback>;
};
