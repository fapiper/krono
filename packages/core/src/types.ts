export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type PriceLevel = {
  price: number;
  quantity: number;
  total: number;
};

export type OrderbookData = {
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

export type KrakenAssetPair = {
  altname: string;
  wsname?: string;
  aclass_base: string;
  base: string;
  aclass_quote: string;
  quote: string;
  pair_decimals: number;
  cost_decimals: number;
  lot_decimals: number;
  lot_multiplier: number;
  leverage_buy?: number[];
  leverage_sell?: number[];
  fees?: number[][];
  fees_maker?: number[][];
  fee_volume_currency?: string;
  margin_call?: number;
  margin_stop?: number;
  ordermin?: string;
  costmin?: string;
  tick_size?: string;
  status?: string;
  long_position_limit?: number;
  short_position_limit?: number;
};

export type SymbolOption = {
  value: string;
  label: string;
  displayLabel: string;
  altname: string;
  wsname?: string;
  baseAsset: string;
  quoteAsset: string;
  baseName?: string;
  icon: string;
};

export type KrakenApiResponse = {
  error: string[];
  result: Record<string, KrakenAssetPair>;
};

export type AssetPairsData = {
  symbols: SymbolOption[];
  symbolMap: Map<string, SymbolOption>;
};

export type AssetPairsConfig = {
  topN?: number;
  autoFetch?: boolean;
  debug?: boolean;
};

export type AssetPairsStatus = 'idle' | 'loading' | 'loaded' | 'error';
