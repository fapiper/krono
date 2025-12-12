import type { IOrderbookStatus } from './types';

export const OrderbookStatusEventKey = {
  StatusUpdate: 'update:status',
  StatusConnectingUpdate: 'update:status:connecting',
  StatusConnectedUpdate: 'update:status:connected',
  StatusDisconnectedUpdate: 'update:status:disconnected',
  Error: 'error',
} as const;

export type OrderbookStatusEventKey =
  (typeof OrderbookStatusEventKey)[keyof typeof OrderbookStatusEventKey];

export type OrderbookStatusEventMap = {
  [OrderbookStatusEventKey.StatusUpdate]: IOrderbookStatus['status'];
  [OrderbookStatusEventKey.StatusConnectingUpdate]: IOrderbookStatus['connecting'];
  [OrderbookStatusEventKey.StatusConnectedUpdate]: IOrderbookStatus['connected'];
  [OrderbookStatusEventKey.StatusDisconnectedUpdate]: IOrderbookStatus['disconnected'];
  [OrderbookStatusEventKey.Error]: IOrderbookStatus['error'] | null;
};
