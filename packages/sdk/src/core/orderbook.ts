import type {
  ConnectionStatus,
  InternalOrderbookConfig,
  OrderbookConfig,
  OrderbookEventMap,
  OrderbookSnapshot,
} from './types';

import {
  HistoryBuffer,
  Logger,
  PriceMapManager,
  TypedEventEmitter,
} from './base';
import {
  type KrakenBookMessageDataItem,
  type KrakenMessage,
  type KrakenSubscription,
  KrakenWebsocket,
} from './connection';
import { DebounceStrategy, ThrottleStrategy, UpdatePipeline } from './pipeline';
import { mergeDeep } from './utils';

const defaultConfig = {
  depth: 25,
  maxHistoryLength: 1000,
  historyEnabled: true,
  debug: false,
  throttleMs: 1_000,
  debounceMs: undefined,
  reconnect: {
    enabled: true,
    maxAttempts: 5,
    delayMs: 3000,
  },
};

/**
 * Orderbook manages market depth updates from Kraken.
 */
export class Orderbook extends TypedEventEmitter<OrderbookEventMap> {
  private config: InternalOrderbookConfig;
  private asksMap = new PriceMapManager();
  private bidsMap = new PriceMapManager();
  private readonly history: HistoryBuffer<OrderbookSnapshot>;
  private _status: ConnectionStatus = 'disconnected';
  private lastUpdateTime = 0;
  private krakenWebsocket: KrakenWebsocket | null = null;
  private logger: Logger;
  private pipeline: UpdatePipeline<OrderbookSnapshot>;

  constructor(config: OrderbookConfig) {
    super();

    this.config = Orderbook.buildConfig(config);

    this.logger = new Logger({
      enabled: this.config.debug,
      prefix: 'Orderbook',
    });

    this.history = new HistoryBuffer(this.config.maxHistoryLength);

    this.pipeline = new UpdatePipeline();
    this.setupPipeline();
  }

  /**
   * Merges user config with defaults.
   */
  private static buildConfig(config: OrderbookConfig): InternalOrderbookConfig {
    return mergeDeep(defaultConfig, config);
  }

  /**
   * Returns connection state.
   */
  get status(): ConnectionStatus {
    return this._status;
  }

  /**
   * Updates status and emits event when changed.
   */
  private set status(value: ConnectionStatus) {
    if (this._status !== value) {
      this._status = value;
      this.emit('statusChange', value);
    }
  }

  /**
   * Returns configured trading symbol.
   */
  get symbol(): string {
    return this.config.symbol;
  }

  /**
   * Updates symbol and reconnects.
   */
  set symbol(newSymbol: string) {
    if (this.config.symbol !== newSymbol) {
      const wasConnected =
        this.status === 'connected' || this.status === 'connecting';

      this.config.symbol = newSymbol;
      this.logger.debug(`Symbol updated to ${newSymbol}.`);

      // Clear old data since it's from a different symbol
      this.asksMap.clear();
      this.bidsMap.clear();
      this.clearHistory();

      // Reconnect if we were connected
      if (wasConnected) {
        this.connect().catch((e) =>
          this.logger.error('Reconnection failed after symbol change', e),
        );
      }
    }
  }

  /**
   * Returns configured orderbook depth.
   */
  get depth(): number {
    return this.config.depth;
  }

  /**
   * Updates depth and reconnects if necessary.
   */
  set depth(newDepth: 10 | 25 | 100 | 500 | 1000) {
    if (this.config.depth !== newDepth) {
      this.config.depth = newDepth;
      this.logger.debug(`Depth updated to ${newDepth}. Resubscribing...`);

      // Only reconnect if we're actively connected
      if (this.status === 'connected' || this.status === 'connecting') {
        this.connect().catch((e) =>
          this.logger.error('Resubscription failed after depth change', e),
        );
      }
    }
  }

  /**
   * Returns throttle time.
   */
  get throttleMs(): number | undefined {
    return this.config.throttleMs;
  }

  /**
   * Updates throttle time and rebuilds pipeline.
   */
  set throttleMs(value: number | undefined) {
    if (this.config.throttleMs !== value) {
      this.config.throttleMs = value;
      this.logger.debug(`Throttle updated to ${value}.`);
      this.reconfigurePipeline();
    }
  }

  /**
   * Returns debounce time.
   */
  get debounceMs(): number | undefined {
    return this.config.debounceMs;
  }

  /**
   * Updates debounce time and rebuilds pipeline.
   */
  set debounceMs(value: number | undefined) {
    if (this.config.debounceMs !== value) {
      this.config.debounceMs = value;
      this.logger.debug(`Debounce updated to ${value}.`);
      this.reconfigurePipeline();
    }
  }

  /**
   * Returns whether history recording is enabled.
   */
  get historyEnabled(): boolean {
    return this.config.historyEnabled;
  }

  /**
   * Enables or disables history recording.
   */
  set historyEnabled(enabled: boolean) {
    if (this.config.historyEnabled !== enabled) {
      this.config.historyEnabled = enabled;
      this.logger.debug(
        `History recording ${enabled ? 'enabled' : 'disabled'}.`,
      );
    }
  }

  /**
   * Returns max history length.
   */
  get maxHistoryLength(): number {
    return this.config.maxHistoryLength;
  }

  /**
   * Updates max history length and resizes buffer.
   */
  set maxHistoryLength(value: number) {
    if (this.config.maxHistoryLength !== value) {
      this.config.maxHistoryLength = value;
      this.history.setMaxLength(value);
      this.logger.debug(`Max history length updated to ${value}.`);
    }
  }

  /**
   * Returns debug mode status.
   */
  get debug(): boolean {
    return this.config.debug;
  }

  /**
   * Enables or disables debug logging.
   */
  set debug(enabled: boolean) {
    if (this.config.debug !== enabled) {
      this.config.debug = enabled;
      this.logger.debug(`Debug mode ${enabled ? 'enabled' : 'disabled'}.`);
      this.logger.enabled = enabled;
    }
  }

  /**
   * Returns the latest snapshot.
   */
  get currentSnapshot(): OrderbookSnapshot | null {
    return this.createSnapshot();
  }

  /**
   * Returns milliseconds elapsed since last market update.
   */
  get timeSinceLastUpdate(): number {
    return Date.now() - this.lastUpdateTime;
  }

  /**
   * Builds orderbook snapshot from internal state.
   */
  private createSnapshot(): OrderbookSnapshot | null {
    const asks = this.asksMap.getSorted(true, this.config.depth);
    const bids = this.bidsMap.getSorted(false, this.config.depth);

    if (!asks.length || !bids.length) return null;

    const bestAsk = asks[0]?.[0] ?? -1;
    const bestBid = bids[0]?.[0] ?? -1;
    const spread = bestAsk - bestBid;

    return {
      timestamp: Date.now(),
      asks,
      bids,
      spread,
      spreadPct: bestAsk ? (spread / bestAsk) * 100 : 0,
    };
  }

  /**
   * Handles initial full snapshot message.
   */
  private handleSnapshot(data: KrakenBookMessageDataItem) {
    this.asksMap.clear();
    this.bidsMap.clear();

    if (data.asks) this.asksMap.batchUpdate(data.asks);
    if (data.bids) this.bidsMap.batchUpdate(data.bids);

    this.status = 'connected';

    const snapshot = this.createSnapshot();
    if (snapshot) this.emit('snapshot', snapshot);
  }

  /**
   * Handles incremental update messages.
   */
  private handleUpdate(data: KrakenBookMessageDataItem) {
    if (data.asks) this.asksMap.batchUpdate(data.asks);
    if (data.bids) this.bidsMap.batchUpdate(data.bids);

    this.lastUpdateTime = Date.now();

    const snapshot = this.createSnapshot();
    if (!snapshot) return;

    this.emit('rawUpdate', snapshot);
    this.pipeline.push(snapshot);
  }

  /**
   * Configures throttling/debouncing pipeline.
   */
  private setupPipeline() {
    this.pipeline.removeAllListeners();

    if (typeof this.config.throttleMs === 'number') {
      this.pipeline.add(new ThrottleStrategy(this.config.throttleMs));
    }
    if (typeof this.config.debounceMs === 'number') {
      this.pipeline.add(new DebounceStrategy(this.config.debounceMs));
    }

    this.pipeline.on('update', (snapshot) => {
      if (this.config.historyEnabled) {
        this.history.push(snapshot);
      }
      this.emit('update', snapshot);
    });
  }

  /**
   * Resets pipeline when configuration changes.
   */
  private reconfigurePipeline() {
    this.pipeline.destroy();
    this.pipeline = new UpdatePipeline();
    this.setupPipeline();
  }

  /**
   * Connects to Kraken websocket and subscribes to book stream.
   */
  async connect() {
    this.disconnect();
    this.status = 'connecting';

    const subscriptionMessage: KrakenSubscription = {
      method: 'subscribe',
      params: {
        channel: 'book',
        symbol: [this.config.symbol],
        snapshot: true,
        depth: this.config.depth,
      },
    };

    const krakenWebsocket = new KrakenWebsocket(subscriptionMessage);

    krakenWebsocket.on('message', (message: KrakenMessage) => {
      if (message.channel !== 'book' || !message.data) return;

      const data = message.data[0];
      if (!data || data.symbol !== this.config.symbol) return;

      if (message.type === 'snapshot') this.handleSnapshot(data);
      else if (message.type === 'update') this.handleUpdate(data);
    });

    krakenWebsocket.on('error', (e: Error) => {
      this.logger.error('websocket error', e);
      this.status = 'error';
      this.emit('error', e);
    });

    krakenWebsocket.on('close', () => {
      this.status = 'disconnected';
    });

    try {
      await krakenWebsocket.connect();
      this.status = 'connected';
      this.krakenWebsocket = krakenWebsocket;
    } catch (e) {
      this.logger.error('websocket connect error', e);
      this.status = 'error';
      this.emit('error', e instanceof Error ? e : new Error(String(e)));
    }
  }

  /**
   * Disconnects websocket if active.
   */
  disconnect() {
    if (this.krakenWebsocket) {
      this.krakenWebsocket.disconnect();
      this.krakenWebsocket = null;
    }

    this.status = 'disconnected';
  }

  /**
   * Fully clears orderbook data and listeners.
   */
  destroy() {
    this.disconnect();
    this.pipeline.destroy();
    this.removeAllListeners();
    this.asksMap.clear();
    this.bidsMap.clear();
    this.history.clear();
  }

  /**
   * Manually inserts snapshot into history buffer.
   */
  addToHistory(snapshot: OrderbookSnapshot) {
    this.history.push(snapshot);
  }

  /**
   * Returns history buffer instance.
   */
  getHistory() {
    return this.history;
  }

  /**
   * Clears all recorded history.
   */
  clearHistory() {
    this.history.clear();
  }
}
