/*
// types.ts
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

export type KrakenAssetPairsData = {
  topSymbols: SymbolOption[];
  symbolMap: Map<string, SymbolOption>;
};

// fetchKrakenAssetPairs.ts
const KRAKEN_API_URL = 'https://api.kraken.com/0/public/AssetPairs';

/!**
 * Priority quotes for filtering most liquid pairs
 *!/
const PRIORITY_QUOTES = [
  'USD',
  'USDT',
  'EUR',
  'GBP',
  'USDC',
  'BTC',
  'XBT',
  'ETH',
];

/!**
 * Map Kraken asset codes to standard crypto symbols
 *!/
const ASSET_SYMBOL_MAP: Record<string, string> = {
  // Bitcoin variants
  XBT: 'BTC',
  XXBT: 'BTC',

  // Major cryptos with X prefix
  XETH: 'ETH',
  XXRP: 'XRP',
  XLTC: 'LTC',
  XXLM: 'XLM',
  XDAO: 'DAO',
  XETC: 'ETC',
  XICN: 'ICN',
  XMLN: 'MLN',
  XNMC: 'NMC',
  XREP: 'REP',
  XXDG: 'DOGE',
  XXMR: 'XMR',
  XZEC: 'ZEC',

  // Fiat with Z prefix
  ZUSD: 'USD',
  ZEUR: 'EUR',
  ZGBP: 'GBP',
  ZCAD: 'CAD',
  ZJPY: 'JPY',
  ZAUD: 'AUD',
  ZKRW: 'KRW',
};

/!**
 * Full names for popular cryptocurrencies
 *!/
const CRYPTO_NAMES: Record<string, string> = {
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  SOL: 'Solana',
  XRP: 'Ripple',
  ADA: 'Cardano',
  DOGE: 'Dogecoin',
  MATIC: 'Polygon',
  AVAX: 'Avalanche',
  LINK: 'Chainlink',
  DOT: 'Polkadot',
  ATOM: 'Cosmos',
  UNI: 'Uniswap',
  LTC: 'Litecoin',
  TRX: 'Tron',
  BCH: 'Bitcoin Cash',
  XLM: 'Stellar',
  NEAR: 'NEAR Protocol',
  APT: 'Aptos',
  ALGO: 'Algorand',
  MANA: 'Decentraland',
  SAND: 'The Sandbox',
  GRT: 'The Graph',
  FIL: 'Filecoin',
  FTM: 'Fantom',
  SNX: 'Synthetix',
  AAVE: 'Aave',
  MKR: 'Maker',
  COMP: 'Compound',
  INJ: 'Injective',
  OP: 'Optimism',
  ARB: 'Arbitrum',
  SUI: 'Sui',
  PEPE: 'Pepe',
  SHIB: 'Shiba Inu',
  WIF: 'dogwifhat',
  BONK: 'Bonk',
  FLOKI: 'Floki',
};

/!**
 * Get standardized asset symbol for icon lookup
 *!/
function getStandardSymbol(krakenAsset: string): string {
  return ASSET_SYMBOL_MAP[krakenAsset] || krakenAsset;
}

/!**
 * Create a user-friendly display label with proper formatting
 *!/
function createDisplayLabel(
  baseAsset: string,
  quoteAsset: string,
  baseName?: string,
): string {
  return `${baseAsset}/${quoteAsset}`;
}

/!**
 * Get cryptocurrency icon URL from Kraken's CDN
 *!/
function getCryptoIconUrl(symbol: string): string {
  const standardSymbol = getStandardSymbol(symbol).toLowerCase();
  return `https://assets.kraken.com/marketing/web/icons-uni-webp/s_${standardSymbol}.webp?i=kds`;
}

/!**
 * Calculate a liquidity score for sorting pairs
 *!/
function getLiquidityScore(pair: KrakenAssetPair): number {
  let score = 0;

  // Prioritize by quote currency (higher = more liquid)
  const quoteIndex = PRIORITY_QUOTES.indexOf(pair.quote);
  if (quoteIndex !== -1) {
    score += (PRIORITY_QUOTES.length - quoteIndex) * 1000;
  }

  // Prefer pairs with lower minimum order size (more accessible = more liquid)
  if (pair.ordermin) {
    const orderMin = parseFloat(pair.ordermin);
    if (!isNaN(orderMin) && orderMin > 0) {
      score += 100 / orderMin;
    }
  }

  // Prefer pairs with trading enabled
  if (pair.status === 'online') {
    score += 500;
  }

  // Prefer pairs with websocket names (more actively traded)
  if (pair.wsname) {
    score += 200;
  }

  return score;
}

/!**
 * Fetch top trading pairs from Kraken dynamically.
 * Fetches all pairs and filters/sorts by liquidity indicators.
 * Returns data optimized for fast rendering and O(1) lookup with icons.
 *!/
export async function fetchKrakenAssetPairs(
  signal?: AbortSignal,
  topN: number = 100,
): Promise<KrakenAssetPairsData> {
  const response = await fetch(KRAKEN_API_URL, {
    signal,
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = (await response.json()) as KrakenApiResponse;

  if (data.error && data.error.length > 0) {
    throw new Error(`Kraken API Error: ${data.error.join(', ')}`);
  }

  const pairs = data.result;
  const pairEntries: Array<[string, KrakenAssetPair, number]> = [];

  // Calculate liquidity scores for all pairs
  for (const [pairKey, pair] of Object.entries(pairs)) {
    // Skip pairs without wsname (not available on websocket)
    if (!pair.wsname) continue;

    // Skip disabled pairs
    if (pair.status && pair.status !== 'online') continue;

    const score = getLiquidityScore(pair);
    pairEntries.push([pairKey, pair, score]);
  }

  // Sort by liquidity score (descending) and take top N
  pairEntries.sort((a, b) => b[2] - a[2]);
  const topPairs = pairEntries.slice(0, topN);

  const symbolMap = new Map<string, SymbolOption>();
  const symbols: SymbolOption[] = [];

  // Process top pairs
  for (const [pairKey, pair] of topPairs) {
    const baseAsset = getStandardSymbol(pair.base);
    const quoteAsset = getStandardSymbol(pair.quote);
    const baseName = CRYPTO_NAMES[baseAsset];

    const symbol: SymbolOption = {
      value: pair.wsname!,
      label: pair.altname,
      displayLabel: createDisplayLabel(baseAsset, quoteAsset, baseName),
      altname: pair.altname,
      wsname: pair.wsname,
      baseAsset,
      quoteAsset,
      baseName,
      icon: getCryptoIconUrl(pair.base),
    };

    symbols.push(symbol);

    // Multiple indexing strategies for flexible lookup
    symbolMap.set(symbol.value.toUpperCase(), symbol);
    symbolMap.set(symbol.label.toUpperCase(), symbol);
    symbolMap.set(pairKey.toUpperCase(), symbol);

    if (pair.altname.toUpperCase() !== pairKey.toUpperCase()) {
      symbolMap.set(pair.altname.toUpperCase(), symbol);
    }
  }

  // Sort alphabetically for better UX
  symbols.sort((a, b) => a.label.localeCompare(b.label));

  return {
    topSymbols: symbols,
    symbolMap,
  };
}

/!**
 * Fast O(1) symbol lookup using the map.
 *!/
export function findSymbol(
  symbolMap: Map<string, SymbolOption>,
  search: string,
): SymbolOption | undefined {
  return symbolMap.get(search.toUpperCase());
}
*/
