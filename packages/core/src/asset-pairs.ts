import {
  AssetPairsEventKey,
  type AssetPairsEventMap,
} from './asset-pairs-events';
import { Logger } from './base';
import { TypedEventEmitter } from './events';
import type {
  AssetPairsConfig,
  AssetPairsData,
  AssetPairsStatus,
  IAssetPairsConfig,
  IAssetPairsStatus,
  KrakenApiResponse,
  KrakenAssetPair,
  SymbolOption,
} from './types';
import {
  createDisplayLabel,
  getCryptoIconUrl,
  getLiquidityScore,
  getStandardSymbol,
  KRAKEN_API_URL,
  mergeDeep,
} from './utils';

/**
 * AssetPairs facade.
 *
 * Fetches, processes, caches and exposes Kraken trading pairs.
 */
export class AssetPairs
  extends TypedEventEmitter<AssetPairsEventMap>
  implements IAssetPairsConfig, IAssetPairsStatus
{
  /** Default configuration values */
  private static readonly defaultConfig: Required<AssetPairsConfig> = {
    topN: 100,
    autoFetch: true,
    debug: false,
  };

  private logger: Logger;

  private _status: AssetPairsStatus = 'idle';
  private _error: Error | null = null;
  private _data: AssetPairsData = {
    symbols: [],
    symbolMap: new Map(),
  };

  private config: Required<AssetPairsConfig>;
  private abortController: AbortController | null = null;

  /**
   * @param config Asset pairs configuration
   */
  constructor(config: AssetPairsConfig = {}) {
    super();

    this.config = mergeDeep(AssetPairs.defaultConfig, config);

    this.logger = Logger.init({
      enabled: this.config.debug,
      prefix: 'AssetPairs',
    });

    if (this.config.autoFetch) {
      void this.fetch();
    }
  }

  /**
   * Fetches asset pairs from Kraken REST API.
   *
   * @returns Processed asset pair data
   */
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
        throw new Error(`HTTP error: ${response.status}`);
      }

      const apiData = (await response.json()) as KrakenApiResponse;

      if (apiData.error?.length) {
        throw new Error(`Kraken API error: ${apiData.error.join(', ')}`);
      }

      const data = this.processApiResponse(apiData.result);

      this.setData(data);
      this.setStatus('loaded');

      return data;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        this.logger.debug('Fetch aborted');
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

  /**
   * Forces a refetch of asset pairs.
   */
  refresh() {
    return this.fetch();
  }

  /**
   * Clears cached data and resets state to idle.
   */
  clear() {
    this._data = {
      symbols: [],
      symbolMap: new Map(),
    };
    this.setError(null);
    this.setStatus('idle');
  }

  /**
   * Aborts active requests and removes all event listeners.
   */
  destroy() {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.removeAllListeners();
    this.clear();
  }

  /**
   * Finds a symbol by any supported identifier.
   *
   * @param search Symbol string
   */
  findSymbol(search: string): SymbolOption | undefined {
    return this._data.symbolMap.get(search.toUpperCase());
  }

  /** @inheritdoc */
  get loading(): boolean {
    return this.status === 'loading';
  }

  /** @inheritdoc */
  get loaded(): boolean {
    return this.status === 'loaded';
  }

  /** @inheritdoc */
  get status() {
    return this._status;
  }

  /** @inheritdoc */
  get error() {
    return this._error;
  }

  /** @inheritdoc */
  get symbols(): SymbolOption[] {
    return this._data.symbols;
  }

  /** @inheritdoc */
  get symbolMap(): Map<string, SymbolOption> {
    return this._data.symbolMap;
  }

  /** @inheritdoc */
  get topN(): number {
    return this.config.topN;
  }
  set topN(value: number) {
    if (this.config.topN === value) return;
    this.config.topN = value;
    this.emit(AssetPairsEventKey.ConfigUpdate, { ...this.config });

    if (this.loaded) {
      void this.fetch();
    }
  }

  /** @inheritdoc */
  get autoFetch() {
    return this.config.autoFetch;
  }
  set autoFetch(value) {
    if (this.config.autoFetch === value) return;
    this.config.autoFetch = value;
    this.emit(AssetPairsEventKey.ConfigUpdate, { ...this.config });
  }

  /** @inheritdoc */
  get debug(): boolean {
    return this.config.debug;
  }
  set debug(value: boolean) {
    if (this.config.debug === value) return;
    this.config.debug = value;
    this.logger.enabled = value;
    this.emit(AssetPairsEventKey.ConfigUpdate, { ...this.config });
  }

  /**
   * Processes raw Kraken asset pair payload.
   */
  private processApiResponse(
    pairs: Record<string, KrakenAssetPair>,
  ): AssetPairsData {
    const ranked: Array<[string, KrakenAssetPair, number]> = [];

    for (const [key, pair] of Object.entries(pairs)) {
      if (!pair.wsname) continue;
      if (pair.status && pair.status !== 'online') continue;

      ranked.push([key, pair, getLiquidityScore(pair)]);
    }

    ranked.sort((a, b) => b[2] - a[2]);

    const topPairs = ranked.slice(0, this.config.topN);

    const symbols: SymbolOption[] = [];
    const symbolMap = new Map<string, SymbolOption>();

    for (const [pairKey, pair] of topPairs) {
      const baseAsset = getStandardSymbol(pair.base);
      const quoteAsset = getStandardSymbol(pair.quote);
      const displayLabel = createDisplayLabel(baseAsset, quoteAsset);

      const symbol: SymbolOption = {
        value: pair.wsname ?? displayLabel,
        label: pair.altname,
        displayLabel,
        altname: pair.altname,
        wsname: pair.wsname,
        baseAsset,
        quoteAsset,
        icon: getCryptoIconUrl(pair.base),
      };

      symbols.push(symbol);

      symbolMap.set(symbol.value.toUpperCase(), symbol);
      symbolMap.set(symbol.displayLabel.toUpperCase(), symbol);
      symbolMap.set(pairKey.toUpperCase(), symbol);
      symbolMap.set(pair.altname.toUpperCase(), symbol);
    }

    symbols.sort((a, b) => a.label.localeCompare(b.label));

    return { symbols, symbolMap };
  }

  private setData(value: AssetPairsData): void {
    this._data = value;
    this.logger.debug(`Loaded ${value.symbols.length} symbols`);
    this.emit(AssetPairsEventKey.DataUpdate, value);
  }

  private setStatus(value: AssetPairsStatus) {
    if (this._status === value) return;
    this._status = value;
    this.logger.debug(`Status updated to ${value}`);
    this.emit(AssetPairsEventKey.StatusUpdate, value);
  }

  private setError(value: Error | null) {
    this._error = value;
    if (value) {
      this.logger.error(value);
      this.emit(AssetPairsEventKey.Error, value);
    }
  }

  // Event helpers

  onDataUpdate = this.createListener(AssetPairsEventKey.DataUpdate);
  onStatusUpdate = this.createListener(AssetPairsEventKey.StatusUpdate);
  onConfigUpdate = this.createListener(AssetPairsEventKey.ConfigUpdate);
  onError = this.createListener(AssetPairsEventKey.Error);
}
