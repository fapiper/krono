import {
  AssetPairsProvider,
  type AssetPairsProviderProps,
  OrderbookProvider,
  type OrderbookProviderProps,
} from '@krono/hooks';
import type { PropsWithChildren } from 'react';

export interface OrderbookRootProviderProps extends PropsWithChildren {
  config: OrderbookProviderProps['config'] & {
    assetPairs?: AssetPairsProviderProps['config'];
  };
}

export function OrderbookRootProvider({
  children,
  config,
}: OrderbookRootProviderProps) {
  const { assetPairs: assetPairsConfig = {}, ...orderbookConfig } = config;

  return (
    <AssetPairsProvider config={assetPairsConfig}>
      <OrderbookProvider config={orderbookConfig}>{children}</OrderbookProvider>
    </AssetPairsProvider>
  );
}
