import type { PropsWithChildren } from 'react';

export type OrderbookControlsRootProps = PropsWithChildren;

export function OrderbookControlsRoot({
  children,
}: OrderbookControlsRootProps) {
  return <>{children}</>;
}
