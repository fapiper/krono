import type { KrakenBookMessageDataItem } from './kraken-ws-manager';

export const OrderbookConnectionEventKey = {
  Snapshot: 'snapshot',
  Update: 'update',
} as const;

export type OrderbookConnectionEventMap = {
  [OrderbookConnectionEventKey.Snapshot]: KrakenBookMessageDataItem;
  [OrderbookConnectionEventKey.Update]: KrakenBookMessageDataItem;
};
