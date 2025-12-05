'use client';

import { OrderbookProvider } from '@orderbook-visualizer/sdk/react';
import type { PropsWithChildren } from 'react';

export default function SOrderbookProvider({ children }: PropsWithChildren) {
  const config = { symbol: 'BTC/USD' };

  return <OrderbookProvider config={config}>{children}</OrderbookProvider>;
}
