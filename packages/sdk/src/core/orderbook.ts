import { HistoryBuffer, Logger, PriceMapManager } from './base';
import {
  type IOrderbookConfig,
  OrderbookConfig,
  type OrderbookConfigOptions,
} from './config';
import {
  type KrakenBookMessageDataItem,
  type KrakenMessage,
  type KrakenSubscription,
  KrakenWebsocket,
} from './connection';
import { OrderbookEventEmitter } from './orderbook-event-emitter';
import { DebounceStrategy, ThrottleStrategy, UpdatePipeline } from './pipeline';
import type { ConnectionStatus, OrderbookData } from './types';

/**
 * Orderbook manages market depth updates from Kraken.
 */
export class Orderbook
  extends OrderbookEventEmitter
  implements IOrderbookConfig
{
  private config: OrderbookConfig;
  private asksMap = new PriceMapManager();
  private bidsMap = new PriceMapManager();
  private readonly history: HistoryBuffer<OrderbookData>;
  private _status: ConnectionStatus = 'disconnected';
  private lastUpdateTime = 0;
  private krakenWebsocket: KrakenWebsocket | null = null;
  private logger: Logger;
  private pipeline: UpdatePipeline<OrderbookData>;

  constructor(config: OrderbookConfigOptions) {
    super();

    this.config = new OrderbookConfig(config);
    this.logger = new Logger({
      enabled: this.config.debug,
      prefix: 'Orderbook',
    });

    this.history = new HistoryBuffer(this.config.maxHistoryLength);

    this.pipeline = new UpdatePipeline();
    this.setupPipeline();
    this.setupConfigListeners();
  }

  /**
   * Sets up listeners for config changes
   */
  private setupConfigListeners() {
    this.config.onUpdateConfigSymbol(() => {
      // Symbol change: clear data and reconnect if needed
      const wasConnected =
        this.status === 'connected' || this.status === 'connecting';

      this.asksMap.clear();
      this.bidsMap.clear();
      this.clearHistory();

      if (wasConnected) {
        this.connect().catch((e) =>
          this.logger.error('Reconnection failed after symbol change', e),
        );
      }
    });

    this.config.onUpdateConfigDepth(() => {
      // Depth change: reconnect if needed

      if (this.status === 'connected' || this.status === 'connecting') {
        this.connect().catch((e) =>
          this.logger.error('Resubscription failed after depth change', e),
        );
      }
    });

    this.config.onUpdateConfigThrottleMs(() => {
      // Throttle change: rebuild pipeline
      this.reconfigurePipeline();
    });

    this.config.onUpdateConfigDebounceMs(() => {
      // Debounce change: rebuild pipeline
      this.reconfigurePipeline();
    });

    this.config.onUpdateConfigSpreadGrouping(() => {
      // Spread grouping change: emit new data
      const data = this.createData();
      if (data) {
        this.emitDataUpdate(data);
      }
    });

    this.config.onUpdateConfigMaxHistoryLength((value) => {
      // Max history length change: resize buffer
      this.history.setMaxLength(value);
    });

    this.config.onUpdateConfigDebug((value) => {
      // Debug mode change: update logger
      this.logger.enabled = value;
    });

    this.config.onUpdateConfig((newConfig) => {
      // Emit all config updates
      this.emitConfigUpdate(newConfig);
    });
  }

  get symbol() {
    return this.config.symbol;
  }

  set symbol(value) {
    this.config.symbol = value;
  }

  get depth() {
    return this.config.depth;
  }

  set depth(value) {
    this.config.depth = value;
  }

  get throttleMs() {
    return this.config.throttleMs;
  }

  set throttleMs(value) {
    this.config.throttleMs = value;
  }

  get debounceMs() {
    return this.config.debounceMs;
  }

  set debounceMs(value) {
    this.config.debounceMs = value;
  }

  get historyEnabled() {
    return this.config.historyEnabled;
  }

  set historyEnabled(value) {
    this.config.historyEnabled = value;
  }

  get spreadGrouping() {
    return this.config.spreadGrouping;
  }

  set spreadGrouping(value) {
    this.config.spreadGrouping = value;
  }

  get maxHistoryLength() {
    return this.config.maxHistoryLength;
  }

  set maxHistoryLength(value) {
    this.config.maxHistoryLength = value;
  }

  get debug() {
    return this.config.debug;
  }

  set debug(value) {
    this.config.debug = value;
  }

  get reconnect() {
    return this.config.reconnect;
  }

  set reconnect(value) {
    this.config.reconnect = value;
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
  set status(value: ConnectionStatus) {
    if (this._status !== value) {
      this._status = value;
      this.emitStatusUpdate(value);
    }
  }

  /**
   * Returns the latest orderbook data.
   */
  get currentData(): OrderbookData {
    return this.createData();
  }

  /**
   * Returns milliseconds elapsed since last market update.
   */
  get timeSinceLastUpdate(): number {
    return Date.now() - this.lastUpdateTime;
  }

  /**
   * Builds orderbook data from internal state.
   */
  private createData(): OrderbookData {
    const asks = this.asksMap.getSorted(true, this.config.depth);
    const bids = this.bidsMap.getSorted(false, this.config.depth);

    if (!asks.length || !bids.length) {
      return {
        timestamp: Date.now(),
        asks: [],
        bids: [],
        spread: 0,
        spreadPct: 0,
        maxAskTotal: 0,
        maxBidTotal: 0,
        maxTotal: 0,
      };
    }

    const bestAsk = asks[0]?.price ?? -1;
    const bestBid = bids[0]?.price ?? -1;
    const spread = bestAsk - bestBid;

    const maxAskTotal = asks[asks.length - 1]?.total ?? 0;
    const maxBidTotal = bids[bids.length - 1]?.total ?? 0;
    const maxTotal = Math.max(maxAskTotal, maxBidTotal);

    return {
      timestamp: Date.now(),
      asks,
      bids,
      spread,
      spreadPct: bestAsk ? (spread / bestAsk) * 100 : 0,
      maxAskTotal,
      maxBidTotal,
      maxTotal,
    };
  }

  /**
   * Handles initial full snapshot message from Kraken.
   */
  private handleSnapshot(messageData: KrakenBookMessageDataItem) {
    this.asksMap.clear();
    this.bidsMap.clear();

    this.status = 'connected';

    this.processMessageData(messageData);
  }

  /**
   * Handles incremental update messages from Kraken.
   */
  private handleUpdate(messageData: KrakenBookMessageDataItem) {
    this.processMessageData(messageData);
  }

  /**
   * Processes data messages from Kraken.
   */
  private processMessageData(messageData: KrakenBookMessageDataItem) {
    if (messageData.asks) {
      this.asksMap.batchUpdate(messageData.asks);
    }
    if (messageData.bids) {
      this.bidsMap.batchUpdate(messageData.bids);
    }

    this.lastUpdateTime = Date.now();

    const data = this.createData();
    if (!data) {
      return;
    }

    this.emitRawUpdate(data);
    this.pipeline.push(data);
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

    this.pipeline.on('update', (data) => {
      if (this.config.historyEnabled) {
        this.history.push(data);
        this.emitHistoryUpdate(this.history.getAll());
      }
      this.emitDataUpdate(data);
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
      if (message.channel !== 'book' || !message.data) {
        return;
      }

      const messageData = message.data[0];
      if (!messageData || messageData.symbol !== this.config.symbol) {
        return;
      }

      switch (message.type) {
        case 'snapshot':
          this.handleSnapshot(messageData);
          break;
        case 'update':
          this.handleUpdate(messageData);
          break;
      }
    });

    krakenWebsocket.on('error', (e: Error) => {
      this.logger.error('websocket error', e);
      this.status = 'error';
      this.emitError(e);
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
      this.emitError(e instanceof Error ? e : new Error(String(e)));
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
   * Manually inserts data into history buffer.
   */
  addToHistory(data: OrderbookData) {
    this.history.push(data);
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
