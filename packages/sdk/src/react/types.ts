import type { OrderbookSnapshot } from '../core';

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
