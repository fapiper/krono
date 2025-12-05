export type ReconnectConfig = {
  enabled?: boolean;
  maxRetries?: number;
  delayMs?: number;
};

export type PriceLevel = [price: number, volume: number];

export interface OrderbookSnapshot {
  timestamp: number;
  asks: PriceLevel[];
  bids: PriceLevel[];
  spread: number;
  spreadPct: number;
  checksum?: number;
}

export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error';

export type OrderbookConfig = {
  symbol: string;
  depth?: 100 | 10 | 25 | 500 | 1000;
  maxHistoryLength?: number;
  historyEnabled?: boolean;
  debug?: boolean;
  throttleMs?: number;
  debounceMs?: number;
  reconnect?: ReconnectConfig;
};

export type InternalOrderbookConfig = {
  symbol: string;
  depth: 100 | 10 | 25 | 500 | 1000;
  maxHistoryLength: number;
  historyEnabled: boolean;
  debug: boolean;
  throttleMs?: number;
  debounceMs?: number;
  reconnect: {
    enabled: boolean;
    maxAttempts: number;
    delayMs: number;
  };
};

export type OrderbookEventMap = {
  snapshot: OrderbookSnapshot;
  update: OrderbookSnapshot;
  rawUpdate: OrderbookSnapshot;
  statusChange: ConnectionStatus;
  error: Error;
  reconnect: { attempt: number; maxAttempts: number };
};

// biome-ignore lint/suspicious/noExplicitAny:
export type EventListener<T = any> = (data: T) => void;
