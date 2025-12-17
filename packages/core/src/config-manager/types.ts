import { OrderbookEventKey } from '../orderbook-events';
import type { DeepPartial } from '../types';

export interface IOrderbookConfig {
  symbol: string;
  limit: number;
  depth: 100 | 10 | 25 | 500 | 1000;
  maxHistoryLength: number;
  historyEnabled: boolean;
  spreadGrouping: number;
  debug: boolean;
  throttleMs?: number;
  debounceMs?: number;
  reconnect: {
    enabled: boolean;
    maxAttempts: number;
    delayMs: number;
  };
}

export type OrderbookConfigOptions = { symbol: string } & DeepPartial<
  Omit<IOrderbookConfig, 'symbol'>
>;
