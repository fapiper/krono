// Shared and core types

/**
 * Recursively makes all properties optional.
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * General connection lifecycle state.
 */
export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error';

// Asset pairs

/**
 * Internal loading states for the AssetPairs service.
 */
export type AssetPairsStatus = 'idle' | 'loading' | 'loaded' | 'error';

/**
 * Public interface for AssetPairs configuration.
 */
export interface IAssetPairsConfig {
  /** Maximum number of pairs to track, ranked by liquidity */
  topN: number;
  /** Whether to fetch data immediately upon instantiation */
  autoFetch: boolean;
  /** Enables verbose debug logging */
  debug: boolean;
}

/**
 * User-provided options for AssetPairs.
 */
export type AssetPairsConfig = Partial<IAssetPairsConfig>;

/**
 * Public state and status indicators for AssetPairs.
 */
export interface IAssetPairsStatus {
  /** Current operational status */
  status: AssetPairsStatus;
  /** Last error encountered during fetching, if any */
  error: Error | null;
  /** True if the service is currently fetching data */
  loading: boolean;
  /** True if data has been successfully loaded at least once */
  loaded: boolean;
}

/**
 * Trading symbol.
 */
export type SymbolOption = {
  /** Primary symbol value (e.g. "XBT/USD") */
  value: string;
  /** Kraken alternative name (e.g. "XBTUSD") */
  label: string;
  /** User-facing display label (e.g. "BTC/USD") */
  displayLabel: string;
  /** Kraken altname */
  altname: string;
  /** Kraken websocket name */
  wsname?: string;
  /** Base asset symbol */
  baseAsset: string;
  /** Quote asset symbol */
  quoteAsset: string;
  /** Optional full base asset name */
  baseName?: string;
  /** Icon URL for base asset */
  icon: string;
};

/**
 * Processed and cached asset pair data.
 */
export type AssetPairsData = {
  /** Sorted list of symbols */
  symbols: SymbolOption[];
  /** Lookup map for fast symbol resolution by any known key */
  symbolMap: Map<string, SymbolOption>;
};

/**
 * Kraken API schema for a single asset pair.
 */
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
  status?: string; // e.g. "online"
  long_position_limit?: number;
  short_position_limit?: number;
};

/**
 * Shape of the Kraken REST API response for asset pairs.
 */
export type KrakenApiResponse = {
  error: string[];
  result: Record<string, KrakenAssetPair>;
};

// Orderbook types

/**
 * Single price level in the orderbook.
 */
export type PriceLevel = {
  /** Price of the level */
  price: number;
  /** Quantity available at this price */
  quantity: number;
  /** Cumulative quantity up to this level */
  total: number;
};

/**
 * Computed orderbook snapshot with spread and depth analysis.
 */
export type OrderbookData = {
  /** Timestamp (epoch ms) when snapshot was created */
  timestamp: number;
  /** Sorted ask price levels (ascending) */
  asks: PriceLevel[];
  /** Sorted bid price levels (descending) */
  bids: PriceLevel[];
  /** Absolute bid–ask spread */
  spread: number;
  /** Spread expressed as percentage of best ask */
  spreadPct: number;
  /** Maximum cumulative ask size in the current view */
  maxAskTotal: number;
  /** Maximum cumulative bid size in the current view */
  maxBidTotal: number;
  /** Global maximum cumulative size (ask or bid) */
  maxTotal: number;
  /** Optional exchange-provided checksum */
  checksum?: number;
};
