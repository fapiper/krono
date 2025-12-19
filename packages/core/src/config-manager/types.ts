import { OrderbookEventKey } from '../orderbook-events';
import type { DeepPartial } from '../types';

export interface IOrderbookConfig {
  /** Trading pair symbol (e.g. "BTC/USD") */
  symbol: string;

  /** Maximum number of visible price levels */
  limit: number;

  /** Kraken subscription depth */
  depth: 10 | 25 | 100 | 500 | 1000;

  /** Maximum number of stored history snapshots */
  maxHistoryLength: number;

  /** Enables recording of historical snapshots */
  historyEnabled: boolean;

  /** Minimum price increment for the current symbol */
  tickSize: number;

  /** Valid grouping steps (1 -> 2.5 -> 5 sequence) */
  // groupingOptions: number[];

  /** Price grouping step size */
  spreadGrouping: number;

  /** Enables debug logging */
  debug: boolean;

  /** Throttle interval in milliseconds */
  throttleMs?: number;

  /** Debounce interval in milliseconds */
  debounceMs?: number;

  /** Reconnection behavior */
  reconnect: {
    /** Enables automatic reconnect */
    enabled: boolean;
    /** Maximum reconnect attempts */
    maxAttempts: number;
    /** Delay between reconnect attempts (ms) */
    delayMs: number;
  };
}

/**
 * User-provided orderbook configuration.
 */
export type OrderbookConfigOptions = {
  /** Trading pair symbol (e.g. "BTC/USD") */
  symbol: string;
} & DeepPartial<Omit<IOrderbookConfig, 'symbol' | 'groupingOptions'>>;
