'use client';

import { OrderbookProvider as KronoOrderbookProvider } from '@krono/sdk/react';
import type { PropsWithChildren } from 'react';

export default function OrderbookProvider({ children }: PropsWithChildren) {
  const config = { symbol: 'BTC/USD', debug: true, depth: 100 as const };

  return (
    <KronoOrderbookProvider config={config}>{children}</KronoOrderbookProvider>
  );
}
