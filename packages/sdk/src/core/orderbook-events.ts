import {
  type IOrderbookConfig,
  OrderbookConfigEventKey,
  type OrderbookConfigEventMap,
} from './config';
import { TypedEventEmitter } from './events';
import type { ConnectionStatus, OrderbookData } from './types';

export const OrderbookEventKey = {
  Data: 'data',
  DataUpdate: 'update:data',
  RawDataUpdate: 'update:raw_data',
  HistoryUpdate: 'update:history',
  StatusUpdate: 'update:status',
  Error: 'error',
  ...OrderbookConfigEventKey,
} as const;

export type OrderbookEventKey =
  (typeof OrderbookEventKey)[keyof typeof OrderbookEventKey];

export type OrderbookEventMap = OrderbookConfigEventMap & {
  [OrderbookEventKey.Data]: OrderbookData;
  [OrderbookEventKey.DataUpdate]: OrderbookData;
  [OrderbookEventKey.HistoryUpdate]: OrderbookData[];
  [OrderbookEventKey.RawDataUpdate]: OrderbookData;
  [OrderbookEventKey.StatusUpdate]: ConnectionStatus;
  [OrderbookEventKey.Error]: Error;
};
