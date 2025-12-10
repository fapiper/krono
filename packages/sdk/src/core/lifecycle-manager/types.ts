import { OrderbookEventKey } from '../orderbook-events';
import type { DeepPartial } from '../types';

export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error';

export interface IOrderbookLifecycle {
  status: ConnectionStatus;
  error?: Error;
  connecting: boolean;
  connected: boolean;
  disconnected: boolean;
}
