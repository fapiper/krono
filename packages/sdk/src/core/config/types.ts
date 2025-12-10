import { OrderbookEventKey } from '../orderbook-event-emitter';
import type { DeepPartial } from '../types';

export type OrderbookConfigEventMap = {
  [OrderbookEventKey.UpdateConfig]: IOrderbookConfig;
  [OrderbookEventKey.UpdateConfigSymbol]: IOrderbookConfig['symbol'];
  [OrderbookEventKey.UpdateConfigDepth]: IOrderbookConfig['depth'];
  [OrderbookEventKey.UpdateConfigMaxHistoryLength]: IOrderbookConfig['maxHistoryLength'];
  [OrderbookEventKey.UpdateConfigHistoryEnabled]: IOrderbookConfig['historyEnabled'];
  [OrderbookEventKey.UpdateConfigSpreadGrouping]: IOrderbookConfig['spreadGrouping'];
  [OrderbookEventKey.UpdateConfigDebug]: IOrderbookConfig['debug'];
  [OrderbookEventKey.UpdateConfigThrottleMs]: IOrderbookConfig['throttleMs'];
  [OrderbookEventKey.UpdateConfigDebounceMs]: IOrderbookConfig['debounceMs'];
  [OrderbookEventKey.UpdateConfigReconnect]: IOrderbookConfig['reconnect'];
};

export interface IOrderbookConfig {
  symbol: string;
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
