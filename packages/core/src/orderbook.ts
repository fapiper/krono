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
  type IOrderbookStatus,
  OrderbookStatusManager,
} from './status-manager';
import type { ConnectionStatus, OrderbookData } from './types';

/**
 * Orderbook manages market depth updates from Kraken.
 */
export class Orderbook
  extends TypedEventEmitter<OrderbookEventMap>
  implements IOrderbookConfig, IOrderbookStatus
{
  private configManager: OrderbookConfigManager;
  private statusManager: OrderbookStatusManager;
  private connectionManager: OrderbookConnectionManager;

  private asksMap = new PriceMapManager();
  private bidsMap = new PriceMapManager();
  private historyManager: HistoryBuffer<OrderbookData>;
  private logger: Logger;
  private pipeline: UpdatePipeline<OrderbookData>;

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
   * Wires up the flow: Connection -> Data Map -> Pipeline -> Events
   */
  private setupInternalEvents() {
    // Handle Status Changes
    this.statusManager.onUpdateStatus((val) =>
      this.emit(OrderbookEventKey.StatusUpdate, val),
    );
    this.statusManager.onError(
      (e) => e && this.emit(OrderbookEventKey.Error, e),
    );

    // Handle Connection Data
    this.connectionManager.onSnapshot((data) => this.handleSnapshot(data));
    this.connectionManager.onUpdate((data) => this.handleUpdate(data));

    // Handle Config Changes
    this.setupInternalConfigEvents();
  }
  /**
   * Responds to configuration changes by orchestrating sub-managers.
   */
  private setupInternalConfigEvents() {
    this.configManager.onUpdateConfigSymbol(() => {
      this.asksMap.clear();
      this.bidsMap.clear();
      this.historyManager.clear();

      if (this.statusManager.connected || this.statusManager.connecting) {
        void this.connectionManager.connect();
      }
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

  private handleSnapshot(data: KrakenBookMessageDataItem) {
    this.asksMap.clear();
    this.bidsMap.clear();
    this.processMessageData(data);
  }

  private handleUpdate(data: KrakenBookMessageDataItem) {
    this.processMessageData(data);
  }

  private processMessageData(messageData: KrakenBookMessageDataItem) {
    if (messageData.asks) this.asksMap.batchUpdate(messageData.asks);
    if (messageData.bids) this.bidsMap.batchUpdate(messageData.bids);

    const data = this.createData();
    if (!data) return;

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

  connect() {
    return this.connectionManager.connect();
  }

  disconnect() {
    this.connectionManager.disconnect();
  }

  destroy() {
    this.disconnect();
    this.pipeline.destroy();
    this.removeAllListeners();
    this.asksMap.clear();
    this.bidsMap.clear();
    this.historyManager.clear();
  }

  get history() {
    return this.historyManager.getAll();
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
    return this.statusManager.status;
  }

  set status(value) {
    this.statusManager.status = value;
  }

  get connected() {
    return this.statusManager.connected;
  }

  get connecting() {
    return this.statusManager.connecting;
  }

  get disconnected() {
    return this.statusManager.disconnected;
  }

  get error() {
    return this.statusManager.error;
  }

  set error(value) {
    this.statusManager.error = value;
  }

  /**
   * Returns the latest orderbook data.
   */
  get currentData(): OrderbookData {
    return this.createData();
  }

  onData = this.createListener(OrderbookEventKey.Data);
  onDataUpdate = this.createListener(OrderbookEventKey.DataUpdate);
  onHistoryUpdate = this.createListener(OrderbookEventKey.HistoryUpdate);
  onRawDataUpdate = this.createListener(OrderbookEventKey.RawDataUpdate);
  onStatusUpdate = this.createListener(OrderbookEventKey.StatusUpdate);
  onConfigUpdate = this.createListener(OrderbookEventKey.ConfigUpdate);
  onError = this.createListener(OrderbookEventKey.Error);
}
