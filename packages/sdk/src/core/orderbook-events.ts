import {
  OrderbookConfigEventKey,
  type OrderbookConfigEventMap,
} from './config-manager';
import {
  OrderbookLifecycleEventKey,
  type OrderbookLifecycleEventMap,
} from './lifecycle-manager';
import type { ConnectionStatus, OrderbookData } from './types';

export const OrderbookEventKey = {
  Data: 'data',
  DataUpdate: 'update:data',
  RawDataUpdate: 'update:raw_data',
  HistoryUpdate: 'update:history',
  ...OrderbookLifecycleEventKey,
  ...OrderbookConfigEventKey,
} as const;

export type OrderbookEventKey =
  (typeof OrderbookEventKey)[keyof typeof OrderbookEventKey];

export type OrderbookEventMap = OrderbookLifecycleEventMap &
  OrderbookConfigEventMap & {
    [OrderbookEventKey.Data]: OrderbookData;
    [OrderbookEventKey.DataUpdate]: OrderbookData;
    [OrderbookEventKey.HistoryUpdate]: OrderbookData[];
    [OrderbookEventKey.RawDataUpdate]: OrderbookData;
    [OrderbookEventKey.StatusUpdate]: ConnectionStatus;
    [OrderbookEventKey.Error]: Error;
  };
