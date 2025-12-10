import { HistoryBuffer, Logger, PriceMapManager } from './base';
import {
  type IOrderbookConfig,
  OrderbookConfigManager,
  type OrderbookConfigOptions,
} from './config-manager';
import {
  type KrakenBookMessageDataItem,
  type KrakenMessage,
  type KrakenSubscription,
  KrakenWebsocket,
} from './connection';
import { TypedEventEmitter } from './events';
import {
  type IOrderbookLifecycle,
  OrderbookLifecycleManager,
} from './lifecycle-manager';
import { OrderbookEventKey, type OrderbookEventMap } from './orderbook-events';
import { DebounceStrategy, ThrottleStrategy, UpdatePipeline } from './pipeline';
import type { ConnectionStatus, OrderbookData } from './types';

/**
 * Orderbook manages market depth updates from Kraken.
 */
export class Orderbook
  extends TypedEventEmitter<OrderbookEventMap>
  implements IOrderbookConfig, IOrderbookLifecycle
{
  private configManager: OrderbookConfigManager;
  private lifecycleManager: OrderbookLifecycleManager;
  private asksMap = new PriceMapManager();
  private bidsMap = new PriceMapManager();
  private history: HistoryBuffer<OrderbookData>;
  private krakenWebsocket: KrakenWebsocket | null = null;
  private logger: Logger;
  private pipeline: UpdatePipeline<OrderbookData>;

  constructor(config: OrderbookConfigOptions) {
    super();

    this.logger = new Logger({
      enabled: config.debug,
      prefix: 'Orderbook',
    });
    this.configManager = new OrderbookConfigManager(this.logger, config);
    this.logger.enabled = this.configManager.debug;

    this.lifecycleManager = new OrderbookLifecycleManager(this.logger);
    this.history = new HistoryBuffer(this.configManager.maxHistoryLength);
    this.pipeline = new UpdatePipeline();
    this.setupPipeline();
    this.setupEventListeners();
  }

  /**
   * Sets up listeners for config changes
   */
  private setupEventListeners() {
    this.lifecycleManager.onUpdateStatus((value) => {
      this.emit(OrderbookEventKey.StatusUpdate, value);
    });

    this.configManager.onUpdateConfigSymbol(() => {
      // Symbol change: clear data and reconnect if needed
      const wasConnected =
        this.lifecycleManager.connected || this.lifecycleManager.connecting;

      this.asksMap.clear();
      this.bidsMap.clear();
      this.clearHistory();

      if (wasConnected) {
        this.connect().catch((e) =>
          this.logger.error('Reconnection failed after symbol change', e),
        );
      }
    });

    this.configManager.onUpdateConfigDepth(() => {
      // Depth change: reconnect if needed

      if (this.status === 'connected' || this.status === 'connecting') {
        this.connect().catch((e) =>
          this.logger.error('Resubscription failed after depth change', e),
        );
      }
    });

    this.configManager.onUpdateConfigThrottleMs(() => {
      // Throttle change: rebuild pipeline
      this.reconfigurePipeline();
    });

    this.configManager.onUpdateConfigDebounceMs(() => {
      // Debounce change: rebuild pipeline
      this.reconfigurePipeline();
    });

    this.configManager.onUpdateConfigSpreadGrouping(() => {
      // Spread grouping change: emit new data
      const data = this.createData();
      this.emit(OrderbookEventKey.DataUpdate, data);
    });

    this.configManager.onUpdateConfigMaxHistoryLength((value) => {
      // Max history length change: resize buffer
      this.history.setMaxLength(value);
    });

    this.configManager.onUpdateConfigDebug((value) => {
      // Debug mode change: update logger
      this.logger.enabled = value;
    });

    this.configManager.onUpdateConfig((value) => {
      // Emit all config updates
      this.emit(OrderbookEventKey.ConfigUpdate, value);
    });
  }

  get symbol() {
    return this.configManager.symbol;
  }

  set symbol(value) {
    this.configManager.symbol = value;
  }

  get depth() {
    return this.configManager.depth;
  }

  set depth(value) {
    this.configManager.depth = value;
  }

  get throttleMs() {
    return this.configManager.throttleMs;
  }

  set throttleMs(value) {
    this.configManager.throttleMs = value;
  }

  get debounceMs() {
    return this.configManager.debounceMs;
  }

  set debounceMs(value) {
    this.configManager.debounceMs = value;
  }

  get historyEnabled() {
    return this.configManager.historyEnabled;
  }

  set historyEnabled(value) {
    this.configManager.historyEnabled = value;
  }

  get spreadGrouping() {
    return this.configManager.spreadGrouping;
  }

  set spreadGrouping(value) {
    this.configManager.spreadGrouping = value;
  }

  get maxHistoryLength() {
    return this.configManager.maxHistoryLength;
  }

  set maxHistoryLength(value) {
    this.configManager.maxHistoryLength = value;
  }

  get debug() {
    return this.configManager.debug;
  }

  set debug(value) {
    this.configManager.debug = value;
  }

  get reconnect() {
    return this.configManager.reconnect;
  }

  set reconnect(value) {
    this.configManager.reconnect = value;
  }

  get status(): ConnectionStatus {
    return this.lifecycleManager.status;
  }

  set status(value) {
    this.lifecycleManager.status = value;
  }

  get connected() {
    return this.lifecycleManager.connected;
  }

  get connecting() {
    return this.lifecycleManager.connecting;
  }

  get disconnected() {
    return this.lifecycleManager.disconnected;
  }

  get error() {
    return this.lifecycleManager.error;
  }

  set error(value) {
    this.lifecycleManager.error = value;
  }

  /**
   * Returns the latest orderbook data.
   */
  get currentData(): OrderbookData {
    return this.createData();
  }

  /**
   * Builds orderbook data from internal state.
   */
  private createData(): OrderbookData {
    const asks = this.asksMap.getSorted(true, this.configManager.depth);
    const bids = this.bidsMap.getSorted(false, this.configManager.depth);

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

    this.lifecycleManager.status = 'connected';

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

    const data = this.createData();
    if (!data) {
      return;
    }

    this.emit(OrderbookEventKey.RawDataUpdate, data);
    this.pipeline.push(data);
  }

  /**
   * Configures throttling/debouncing pipeline.
   */
  private setupPipeline() {
    this.pipeline.removeAllListeners();

    if (typeof this.configManager.throttleMs === 'number') {
      this.pipeline.add(new ThrottleStrategy(this.configManager.throttleMs));
    }
    if (typeof this.configManager.debounceMs === 'number') {
      this.pipeline.add(new DebounceStrategy(this.configManager.debounceMs));
    }

    this.pipeline.on('update', (data) => {
      if (this.configManager.historyEnabled) {
        this.history.push(data);
        this.emit(OrderbookEventKey.HistoryUpdate, this.history.getAll());
      }
      this.emit(OrderbookEventKey.DataUpdate, data);
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
    this.lifecycleManager.status = 'connecting';

    const subscriptionMessage: KrakenSubscription = {
      method: 'subscribe',
      params: {
        channel: 'book',
        symbol: [this.configManager.symbol],
        snapshot: true,
        depth: this.configManager.depth,
      },
    };

    const krakenWebsocket = new KrakenWebsocket(subscriptionMessage);

    krakenWebsocket.on('message', (message: KrakenMessage) => {
      if (message.channel !== 'book' || !message.data) {
        return;
      }

      const messageData = message.data[0];
      if (!messageData || messageData.symbol !== this.configManager.symbol) {
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
      this.lifecycleManager.error = e;
      this.emit(OrderbookEventKey.Error, e);
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
      this.lifecycleManager.error =
        e instanceof Error ? e : new Error(String(e));
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

  onData = this.createListener(OrderbookEventKey.Data);
  onDataUpdate = this.createListener(OrderbookEventKey.DataUpdate);
  onHistoryUpdate = this.createListener(OrderbookEventKey.HistoryUpdate);
  onRawDataUpdate = this.createListener(OrderbookEventKey.RawDataUpdate);
  onStatusUpdate = this.createListener(OrderbookEventKey.StatusUpdate);
  onConfigUpdate = this.createListener(OrderbookEventKey.ConfigUpdate);
  onError = this.createListener(OrderbookEventKey.Error);
}
