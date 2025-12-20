import { OrderbookPanel, type OrderbookPanelProps } from './panel';
import {
  OrderbookRootProvider,
  type OrderbookRootProviderProps,
} from './root-provider';

export type OrderbookRootProps = Pick<OrderbookRootProviderProps, 'config'> &
  OrderbookPanelProps;

export function OrderbookRoot({ config, ...props }: OrderbookRootProps) {
  return (
    <OrderbookRootProvider config={config}>
      <OrderbookPanel {...props} />
    </OrderbookRootProvider>
  );
}
