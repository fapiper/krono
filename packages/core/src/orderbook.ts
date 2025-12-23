import { HistoryBuffer, Logger, PriceMapManager } from './base';
import {
  type IOrderbookConfig,
  OrderbookConfigManager,
  type OrderbookConfigOptions,
} from './config-manager';
import { OrderbookConnectionManager } from './connection-manager';
import type { KrakenBookMessageDataItem } from './connection-manager/kraken-ws-manager';
import { TypedEventEmitter } from './events';
import { OrderbookEventKey, type OrderbookEventMap } from './orderbook-events';
import { DebounceStrategy, ThrottleStrategy, UpdatePipeline } from './pipeline';
import {
  type ConnectionStatus,
  type IOrderbookStatus,
  OrderbookStatusManager,
} from './status-manager';
import type { OrderbookData } from './types';

/**
 * Orderbook facade.
 *
 * Coordinates:
 * - configuration
 * - connection lifecycle
 * - in-memory price maps
 * - update pipeline
 * - event emission
 */
export class Orderbook
  extends TypedEventEmitter<OrderbookEventMap>
  implements IOrderbookConfig, IOrderbookStatus
{
  private logger: Logger;

  private configManager: OrderbookConfigManager;
  private statusManager: OrderbookStatusManager;
  private connectionManager: OrderbookConnectionManager;
  private historyManager: HistoryBuffer<OrderbookData>;

  private pipeline: UpdatePipeline<OrderbookData>;

  private asksMap = new PriceMapManager();
  private bidsMap = new PriceMapManager();

  /**
   * @param config Initial orderbook configuration
   */
  constructor(config: OrderbookConfigOptions) {
    super();
    this.logger = Logger.init({
      enabled: config.debug,
      prefix: 'Orderbook',
    });
    this.configManager = new OrderbookConfigManager(this.logger, config);
    this.statusManager = new OrderbookStatusManager(this.logger);
    this.connectionManager = new OrderbookConnectionManager(
      this.logger,
      this.configManager,
      this.statusManager,
    );
    this.historyManager = new HistoryBuffer(
      this.configManager.maxHistoryLength,
    );
    this.pipeline = new UpdatePipeline();
    this.setupPipeline();
    this.setupInternalEvents();
  }

  /**
   * Wires internal managers together.
   *
   * Flow:
   * Connection → Price maps → Pipeline → Public events
   */
  private setupInternalEvents() {
    this.statusManager.onUpdateStatus((val) => {
      this.emit(OrderbookEventKey.StatusUpdate, val);
    });
    this.statusManager.onError(
      (e) => e && this.emit(OrderbookEventKey.Error, e),
    );

    this.connectionManager.onSnapshot((data) => this.handleSnapshot(data));
    this.connectionManager.onUpdate((data) => this.handleUpdate(data));

    this.setupInternalConfigEvents();
  }

  /**
   * Reacts to config changes and orchestrates side effects.
   */
  private setupInternalConfigEvents() {
    this.configManager.onUpdateConfigSymbol(async () => {
      this.pipeline.clear();
      console.log('clear symbol', this.history, this.pipeline);
      this.asksMap.clear();
      this.bidsMap.clear();
      this.historyManager.clear();
      console.log('clear historyManager', this.history, this.historyManager);

      if (this.statusManager.connected || this.statusManager.connecting) {
        await this.connectionManager.connect();
      }
    });

    this.configManager.onUpdateConfigLimit(() => {
      if (this.depth < this.limit) {
        this.logger.debug('Depth is set lower than limit');
      }
      this.pipeline.clear();
      this.emit(OrderbookEventKey.DataUpdate, this.createData());
    });

    this.configManager.onUpdateConfigDepth(() => {
      if (this.statusManager.connected || this.statusManager.connecting) {
        this.connectionManager.connect();
      }
    });

    this.configManager.onUpdateConfigThrottleMs(() =>
      this.reconfigurePipeline(),
    );
    this.configManager.onUpdateConfigDebounceMs(() =>
      this.reconfigurePipeline(),
    );

    this.configManager.onUpdateConfigSpreadGrouping(() => {
      this.pipeline.clear();
      this.emit(OrderbookEventKey.DataUpdate, this.createData());
    });

    this.configManager.onUpdateConfigMaxHistoryLength((val) =>
      this.historyManager.setMaxLength(val),
    );
    this.configManager.onUpdateConfigDebug((val) => {
      this.logger.enabled = val;
    });
    this.configManager.onUpdateConfig((val) =>
      this.emit(OrderbookEventKey.ConfigUpdate, val),
    );
  }

  /**
   * Builds a snapshot from current price maps.
   *
   * @returns Orderbook data
   */
  private createData(): OrderbookData {
    const grouping = this.configManager.spreadGrouping;
    const asks = this.asksMap.getSorted(
      true,
      this.configManager.limit,
      grouping,
    );
    const bids = this.bidsMap.getSorted(
      false,
      this.configManager.limit,
      grouping,
    );
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
   * Handles full orderbook snapshots.
   * @param data Snapshot payload from Kraken
   */
  private handleSnapshot(data: KrakenBookMessageDataItem) {
    this.asksMap.clear();
    this.bidsMap.clear();
    this.processMessageData(data);
  }

  /**
   * Handles incremental updates.
   * @param data Update payload from Kraken
   */
  private handleUpdate(data: KrakenBookMessageDataItem) {
    this.processMessageData(data);
  }

  /**
   * Applies message data to price maps and emits updates.
   * @param messageData Raw Kraken book message
   */
  private processMessageData(messageData: KrakenBookMessageDataItem) {
    if (messageData.asks) this.asksMap.batchUpdate(messageData.asks);
    if (messageData.bids) this.bidsMap.batchUpdate(messageData.bids);

    const data = this.createData();
    if (!data) return;

    this.emit(OrderbookEventKey.RawDataUpdate, data);
    this.pipeline.push(data);
  }

  /**
   * Builds the pipeline based on current config.
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
        this.historyManager.push(data);
        this.emit(
          OrderbookEventKey.HistoryUpdate,
          this.historyManager.getAll(),
        );
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
   * Connects to the Kraken websocket.
   *
   * @returns Promise that resolves when subscription is established
   */
  connect() {
    return this.connectionManager.connect();
  }

  /**
   * Disconnects from the Kraken WebSocket.
   */
  disconnect() {
    this.connectionManager.disconnect();
  }

  /**
   * Cleans up all internal state and listeners.
   */
  destroy() {
    this.disconnect();
    this.pipeline.destroy();
    this.removeAllListeners();
    this.asksMap.clear();
    this.bidsMap.clear();
    this.historyManager.clear();
  }

  /** Historical orderbook snapshots */
  get history() {
    return this.historyManager.getAll();
  }

  /** @inheritdoc */
  get symbol() {
    return this.configManager.symbol;
  }
  set symbol(value) {
    this.configManager.symbol = value;
  }

  /** @inheritdoc */
  get limit() {
    return this.configManager.limit;
  }
  set limit(value) {
    this.configManager.limit = value;
  }

  /** @inheritdoc */
  get depth() {
    return this.configManager.depth;
  }
  set depth(value) {
    this.configManager.depth = value;
  }

  /** @inheritdoc */
  get throttleMs() {
    return this.configManager.throttleMs;
  }
  set throttleMs(value) {
    this.configManager.throttleMs = value;
  }

  /** @inheritdoc */
  get debounceMs() {
    return this.configManager.debounceMs;
  }
  set debounceMs(value) {
    this.configManager.debounceMs = value;
  }

  /** @inheritdoc */
  get historyEnabled() {
    return this.configManager.historyEnabled;
  }
  set historyEnabled(value) {
    this.configManager.historyEnabled = value;
  }

  /** @inheritdoc */
  get tickSize() {
    return this.configManager.tickSize;
  }
  set tickSize(value) {
    this.configManager.tickSize = value;
  }

  /** @inheritdoc */
  get spreadGrouping() {
    return this.configManager.spreadGrouping;
  }
  set spreadGrouping(value) {
    this.configManager.spreadGrouping = value;
  }

  /** @inheritdoc */
  get maxHistoryLength() {
    return this.configManager.maxHistoryLength;
  }
  set maxHistoryLength(value) {
    this.configManager.maxHistoryLength = value;
  }

  /** @inheritdoc */
  get debug() {
    return this.configManager.debug;
  }
  set debug(value) {
    this.configManager.debug = value;
  }

  /** @inheritdoc */
  get reconnect() {
    return this.configManager.reconnect;
  }
  set reconnect(value) {
    this.configManager.reconnect = value;
  }

  /** @inheritdoc */
  get status(): ConnectionStatus {
    return this.statusManager.status;
  }
  set status(value) {
    this.statusManager.status = value;
  }

  /** @inheritdoc */
  get connected() {
    return this.statusManager.connected;
  }

  /** @inheritdoc */
  get connecting() {
    return this.statusManager.connecting;
  }

  /** @inheritdoc */
  get reconnecting() {
    return this.statusManager.reconnecting;
  }

  /** @inheritdoc */
  get disconnected() {
    return this.statusManager.disconnected;
  }

  /** @inheritdoc */
  get error() {
    return this.statusManager.error;
  }
  set error(value) {
    this.statusManager.error = value;
  }

  /** @inheritdoc */
  get groupingOptions() {
    return this.configManager.groupingOptions;
  }

  /** Latest computed orderbook snapshot */
  get currentData(): OrderbookData {
    return this.createData();
  }

  // Event helpers

  onData = this.createListener(OrderbookEventKey.Data);
  onDataUpdate = this.createListener(OrderbookEventKey.DataUpdate);
  onHistoryUpdate = this.createListener(OrderbookEventKey.HistoryUpdate);
  onRawDataUpdate = this.createListener(OrderbookEventKey.RawDataUpdate);
  onStatusUpdate = this.createListener(OrderbookEventKey.StatusUpdate);
  onConfigUpdate = this.createListener(OrderbookEventKey.ConfigUpdate);
  onError = this.createListener(OrderbookEventKey.Error);
}
