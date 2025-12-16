'use client';

import {
  AssetPairsProvider,
  type AssetPairsProviderProps,
  OrderbookProvider,
  type OrderbookProviderProps,
} from '@krono/sdk/react';
import type { PropsWithChildren } from 'react';

export type OrderbookRootProps = PropsWithChildren<{
  config: OrderbookProviderProps['config'] & {
    assetPairs?: AssetPairsProviderProps['config'];
  };
}>;

export const OrderbookRoot = ({ children, config }: OrderbookRootProps) => {
  const { assetPairs: assetPairsConfig, ...orderbookConfig } = config;

  return (
    <AssetPairsProvider config={assetPairsConfig ?? {}}>
      <OrderbookProvider config={orderbookConfig}>{children}</OrderbookProvider>
    </AssetPairsProvider>
  );
};
