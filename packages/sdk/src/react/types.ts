import { UseQueryResult } from '@tanstack/react-query';

export type PriceLevel = [price: number, volume: number];

export type OrderbookSnapshot = {
  timestamp: number;
  asks: PriceLevel[];
  bids: PriceLevel[];
  spread: number;
  spreadPct: number;
  checksum?: number;
};

export type OrderbookState = {
  data: OrderbookSnapshot | null;
  isLive: boolean;
  bufferSize: number;
  historyIndex: number;
};

export type OrderbookControls = {
  toggleLive: () => void;
  setHistoryIndex: (idx: number) => void;
  reconnect: () => void;
  clearHistory: () => void;
  goToLatest: () => void;
};
