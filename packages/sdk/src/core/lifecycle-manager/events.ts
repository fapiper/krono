import type { IOrderbookLifecycle } from './types';

export const OrderbookLifecycleEventKey = {
  StatusUpdate: 'update:status',
  StatusConnectingUpdate: 'update:status:connecting',
  StatusConnectedUpdate: 'update:status:connected',
  StatusDisconnectedUpdate: 'update:status:disconnected',
  Error: 'error',
} as const;

export type OrderbookLifecycleEventKey =
  (typeof OrderbookLifecycleEventKey)[keyof typeof OrderbookLifecycleEventKey];

export type OrderbookLifecycleEventMap = {
  [OrderbookLifecycleEventKey.StatusUpdate]: IOrderbookLifecycle['status'];
  [OrderbookLifecycleEventKey.StatusConnectingUpdate]: IOrderbookLifecycle['connecting'];
  [OrderbookLifecycleEventKey.StatusConnectedUpdate]: IOrderbookLifecycle['connected'];
  [OrderbookLifecycleEventKey.StatusDisconnectedUpdate]: IOrderbookLifecycle['disconnected'];
  [OrderbookLifecycleEventKey.Error]: IOrderbookLifecycle['error'];
};
