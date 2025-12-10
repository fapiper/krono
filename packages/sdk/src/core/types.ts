export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type PriceLevel = {
  price: number;
  quantity: number;
  total: number;
};

export type OrderbookSnapshot = {
  timestamp: number;
  asks: PriceLevel[];
  bids: PriceLevel[];
  spread: number;
  spreadPct: number;
  maxAskTotal: number;
  maxBidTotal: number;
  maxTotal: number;
  checksum?: number;
};

export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error';
