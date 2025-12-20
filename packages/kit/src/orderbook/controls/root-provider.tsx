import { OrderbookPlaybackProvider } from '@krono/hooks';
import type { PropsWithChildren } from 'react';

export type OrderbookControlsRootProviderProps = PropsWithChildren;

export function OrderbookControlsRootProvider({
  children,
}: OrderbookControlsRootProviderProps) {
  return <OrderbookPlaybackProvider>{children}</OrderbookPlaybackProvider>;
}
