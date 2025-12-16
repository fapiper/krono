import { OrderbookEventKey } from '../orderbook-events';
import type { DeepPartial } from '../types';
import { OrderbookStatusManager } from './manager';

export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error';

export interface IOrderbookStatus {
  status: ConnectionStatus;
  error: Error | null;
  connecting: boolean;
  connected: boolean;
  disconnected: boolean;
}
