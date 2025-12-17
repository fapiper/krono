import {
  AssetPairsEventKey,
  type AssetPairsEventMap,
} from './asset-pairs-events';
import { TypedEventEmitter } from './events';
import type {
  AssetPairsConfig,
  AssetPairsData,
  AssetPairsStatus,
  KrakenApiResponse,
  KrakenAssetPair,
  SymbolOption,
} from './types';

const KRAKEN_API_URL = 'https://api.kraken.com/0/public/AssetPairs';
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

const ASSET_SYMBOL_MAP: Record<string, string> = {
  XBT: 'BTC',
  XXBT: 'BTC',
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
  ZUSD: 'USD',
  ZEUR: 'EUR',
  ZGBP: 'GBP',
  ZCAD: 'CAD',
  ZJPY: 'JPY',
  ZAUD: 'AUD',
  ZKRW: 'KRW',
};

function getStandardSymbol(krakenAsset: string): string {
  return ASSET_SYMBOL_MAP[krakenAsset] || krakenAsset;
}

function getCryptoIconUrl(symbol: string): string {
  const standardSymbol = getStandardSymbol(symbol).toLowerCase();
  return `https://assets.kraken.com/marketing/web/icons-uni-webp/s_${standardSymbol}.webp?i=kds`;
}

function createDisplayLabel(baseAsset: string, quoteAsset: string): string {
  return `${baseAsset}/${quoteAsset}`;
}

function getLiquidityScore(pair: KrakenAssetPair): number {
  let score = 0;

  const quoteIndex = PRIORITY_QUOTES.indexOf(pair.quote);
  if (quoteIndex !== -1) {
    score += (PRIORITY_QUOTES.length - quoteIndex) * 1000;
  }

  if (pair.ordermin) {
    const orderMin = parseFloat(pair.ordermin);
    if (!Number.isNaN(orderMin) && orderMin > 0) {
      score += 100 / orderMin;
    }
  }

  if (pair.status === 'online') {
    score += 500;
  }

  if (pair.wsname) {
    score += 200;
  }

  return score;
}

/**
 * AssetPairs manages fetching and caching Kraken trading pairs.
 * Follows the same pattern as Orderbook for consistency.
 */
export class AssetPairs extends TypedEventEmitter<AssetPairsEventMap> {
  private _status: AssetPairsStatus = 'idle';
  private _error: Error | null = null;
  private _data: AssetPairsData = {
    symbols: [],
    symbolMap: new Map(),
  };
  private _config: Required<AssetPairsConfig>;
  private abortController: AbortController | null = null;
  private debug: boolean;

  constructor(config: AssetPairsConfig = {}) {
    super();
    this._config = {
      topN: config.topN ?? 100,
      autoFetch: config.autoFetch ?? true,
      debug: config.debug ?? false,
    };
    this.debug = this._config.debug;

    if (this._config.autoFetch) {
      void this.fetch();
    }
  }

  private log(...args: unknown[]) {
    if (this.debug) {
      console.log('[AssetPairs]', ...args);
    }
  }

  private setStatus(status: AssetPairsStatus) {
    if (this._status === status) return;
    this._status = status;
    this.log('Status:', status);
    this.emit(AssetPairsEventKey.StatusUpdate, status);
  }

  private setError(error: Error | null) {
    this._error = error;
    if (error) {
      this.log('Error:', error.message);
      this.emit(AssetPairsEventKey.Error, error);
    }
  }

  private setData(data: AssetPairsData) {
    this._data = data;
    this.log('Data updated:', data.symbols.length, 'symbols');
    this.emit(AssetPairsEventKey.DataUpdate, data);
  }

  async fetch(): Promise<AssetPairsData> {
    if (this.abortController) {
      this.abortController.abort();
    }

    this.abortController = new AbortController();
    this.setStatus('loading');
    this.setError(null);

    try {
      const response = await fetch(KRAKEN_API_URL, {
        signal: this.abortController.signal,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const apiData = (await response.json()) as KrakenApiResponse;

      if (apiData.error && apiData.error.length > 0) {
        throw new Error(`Kraken API Error: ${apiData.error.join(', ')}`);
      }

      const data = this.processApiResponse(apiData.result);
      this.setData(data);
      this.setStatus('loaded');

      return data;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        this.log('Fetch aborted');
        throw err;
      }

      const error = err instanceof Error ? err : new Error('Unknown error');
      this.setError(error);
      this.setStatus('error');
      throw error;
    } finally {
      this.abortController = null;
    }
  }

  private processApiResponse(
    pairs: Record<string, KrakenAssetPair>,
  ): AssetPairsData {
    const pairEntries: Array<[string, KrakenAssetPair, number]> = [];

    for (const [pairKey, pair] of Object.entries(pairs)) {
      if (!pair.wsname) continue;
      if (pair.status && pair.status !== 'online') continue;

      const score = getLiquidityScore(pair);
      pairEntries.push([pairKey, pair, score]);
    }

    pairEntries.sort((a, b) => b[2] - a[2]);
    const topPairs = pairEntries.slice(0, this._config.topN);

    const symbolMap = new Map<string, SymbolOption>();
    const symbols: SymbolOption[] = [];

    for (const [pairKey, pair] of topPairs) {
      const baseAsset = getStandardSymbol(pair.base);
      const quoteAsset = getStandardSymbol(pair.quote);
      const displayLabel = createDisplayLabel(baseAsset, quoteAsset); // i.e. "BTC/USD"
      const symbol: SymbolOption = {
        value: pair.wsname ?? displayLabel, // i.e. (XBT/USD)
        label: pair.altname, // i.e. "XBTUSD"
        displayLabel, // i.e. "BTC/USD"
        altname: pair.altname,
        wsname: pair.wsname,
        baseAsset,
        quoteAsset,
        icon: getCryptoIconUrl(pair.base),
      };

      symbols.push(symbol);

      symbolMap.set(symbol.value.toUpperCase(), symbol); // "XBT/USD"
      symbolMap.set(symbol.displayLabel.toUpperCase(), symbol); // "BTC/USD"
      symbolMap.set(pairKey.toUpperCase(), symbol); // "XXBTZUSD"
      symbolMap.set(pair.altname.toUpperCase(), symbol); // "XBTUSD"

      if (pair.altname.toUpperCase() !== pairKey.toUpperCase()) {
        symbolMap.set(pair.altname.toUpperCase(), symbol);
      }
    }

    symbols.sort((a, b) => a.label.localeCompare(b.label));

    return { symbols, symbolMap };
  }
  findSymbol(search: string): SymbolOption | undefined {
    return this._data.symbolMap.get(search.toUpperCase());
  }

  refresh(): Promise<AssetPairsData> {
    return this.fetch();
  }

  clear() {
    this._data = {
      symbols: [],
      symbolMap: new Map(),
    };
    this._error = null;
    this.setStatus('idle');
  }

  destroy() {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.removeAllListeners();
    this.clear();
  }

  get status(): AssetPairsStatus {
    return this._status;
  }

  get error(): Error | null {
    return this._error;
  }

  get data(): AssetPairsData {
    return this._data;
  }

  get symbols(): SymbolOption[] {
    return this._data.symbols;
  }

  get symbolMap(): Map<string, SymbolOption> {
    return this._data.symbolMap;
  }

  get loading(): boolean {
    return this._status === 'loading';
  }

  get loaded(): boolean {
    return this._status === 'loaded';
  }

  get config(): Required<AssetPairsConfig> {
    return { ...this._config };
  }

  set topN(value: number) {
    if (this._config.topN === value) return;
    this._config.topN = value;
    this.emit(AssetPairsEventKey.ConfigUpdate, this.config);
    if (this.loaded) {
      void this.fetch();
    }
  }

  get topN(): number {
    return this._config.topN;
  }

  onDataUpdate = this.createListener(AssetPairsEventKey.DataUpdate);
  onStatusUpdate = this.createListener(AssetPairsEventKey.StatusUpdate);
  onConfigUpdate = this.createListener(AssetPairsEventKey.ConfigUpdate);
  onError = this.createListener(AssetPairsEventKey.Error);
}
