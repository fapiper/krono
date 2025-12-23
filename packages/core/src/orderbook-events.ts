import {
  OrderbookConfigEventKey,
  type OrderbookConfigEventMap,
} from './config-manager';
import {
  type ConnectionStatus,
  OrderbookStatusEventKey,
  type OrderbookStatusEventMap,
} from './status-manager';
import type { OrderbookData } from './types';

export const OrderbookEventKey = {
  Data: 'data',
  DataUpdate: 'update:data',
  RawDataUpdate: 'update:raw_data',
  HistoryUpdate: 'update:history',
  ...OrderbookStatusEventKey,
  ...OrderbookConfigEventKey,
} as const;

export type OrderbookEventKey =
  (typeof OrderbookEventKey)[keyof typeof OrderbookEventKey];

export type OrderbookEventMap = OrderbookStatusEventMap &
  OrderbookConfigEventMap & {
    [OrderbookEventKey.Data]: OrderbookData;
    [OrderbookEventKey.DataUpdate]: OrderbookData;
    [OrderbookEventKey.HistoryUpdate]: OrderbookData[];
    [OrderbookEventKey.RawDataUpdate]: OrderbookData;
    [OrderbookEventKey.StatusUpdate]: ConnectionStatus;
    [OrderbookEventKey.Error]: Error;
  };
