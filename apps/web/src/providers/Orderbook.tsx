'use client';

import type { OrderbookConfig } from '@krono/sdk/core';
import { OrderbookProvider } from '@krono/sdk/react';
import type { PropsWithChildren } from 'react';

export default function SOrderbookProvider({ children }: PropsWithChildren) {
  const config = { symbol: 'BTC/USD', depth: 100 as const };

  return <OrderbookProvider config={config}>{children}</OrderbookProvider>;
}
