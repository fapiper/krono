import type { Subscription } from 'rxjs';
import { PublicWsTypes, publicWsSubscription } from 'ts-kraken';

import type {
  ConnectionStatus,
  InternalOrderbookConfig,
  OrderbookConfig,
  OrderbookEventMap,
  OrderbookSnapshot,
  OrderbookUpdateItem,
} from './types';

import { HistoryBuffer, PriceMapManager, TypedEventEmitter } from './base';
import { DebounceStrategy, ThrottleStrategy, UpdatePipeline } from './pipeline';
import { mergeDeep } from './utils';

const defaultConfig = {
  depth: 25,
  maxHistoryLength: 1000,
  debug: false,
  throttleMs: undefined,
  debounceMs: undefined,
  reconnect: {
    enabled: true,
    maxAttempts: 5,
    delayMs: 3000,
  },
};

/**
 * Orderbook
 */
export class Orderbook extends TypedEventEmitter<OrderbookEventMap> {
  private config: InternalOrderbookConfig;
  private asksMap = new PriceMapManager();
  private bidsMap = new PriceMapManager();
  private history: HistoryBuffer<OrderbookSnapshot>;
  private subscription: Subscription | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private status: ConnectionStatus = 'disconnected';
  private lastUpdateTime = 0;

  private pipeline: UpdatePipeline<OrderbookSnapshot>;

  constructor(config: OrderbookConfig) {
    super();

    this.config = Orderbook.buildConfig(config);

    this.history = new HistoryBuffer(this.config.maxHistoryLength);

    this.pipeline = new UpdatePipeline();

    if (typeof this.config.throttleMs === 'number') {
      this.pipeline.add(new ThrottleStrategy(this.config.throttleMs));
    }

    if (typeof this.config.debounceMs === 'number') {
      this.pipeline.add(new DebounceStrategy(this.config.debounceMs));
    }

    this.pipeline.on('update', (snapshot) => {
      this.emit('update', snapshot);
    });
  }

  private static buildConfig(config: OrderbookConfig): InternalOrderbookConfig {
    return mergeDeep(defaultConfig, config);
  }

  getStatus(): ConnectionStatus {
    return this.status;
  }

  private setStatus(status: ConnectionStatus) {
    if (this.status !== status) {
      this.status = status;
      this.emit('statusChange', status);
    }
  }

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

  private handleSnapshot(data: OrderbookUpdateItem) {
    this.asksMap.clear();
    this.bidsMap.clear();

    if (data.asks) this.asksMap.batchUpdate(data.asks);
    if (data.bids) this.bidsMap.batchUpdate(data.bids);

    this.reconnectAttempts = 0;
    this.setStatus('connected');

    const snapshot = this.createSnapshot();
    if (snapshot) this.emit('snapshot', snapshot);
  }

  private handleUpdate(data: OrderbookUpdateItem) {
    if (data.asks) this.asksMap.batchUpdate(data.asks);
    if (data.bids) this.bidsMap.batchUpdate(data.bids);

    this.lastUpdateTime = Date.now();

    const snapshot = this.createSnapshot();
    if (!snapshot) return;

    this.emit('rawUpdate', snapshot);
    this.pipeline.push(snapshot);
  }

  connect() {
    this.disconnect();
    this.setStatus('connecting');

    try {
      const observable = publicWsSubscription({
        channel: 'book',
        params: {
          symbol: [this.config.symbol],
          depth: this.config.depth,
          snapshot: true,
        },
      });

      this.subscription = observable.subscribe({
        next: (message) => {
          if (message.channel !== 'book' || !message.data) return;

          const data = message.data[0];
          if (!data || data.symbol !== this.config.symbol) return;

          if (message.type === 'snapshot') this.handleSnapshot(data);
          else if (message.type === 'update') this.handleUpdate(data);
        },
        error: (err) => {
          this.setStatus('error');
          this.emit(
            'error',
            err instanceof Error ? err : new Error(String(err)),
          );
          this.tryReconnect();
        },
        complete: () => this.setStatus('disconnected'),
      });
    } catch (e) {
      this.setStatus('error');
      this.emit('error', e instanceof Error ? e : new Error(String(e)));
    }
  }

  private tryReconnect() {
    if (!this.config.reconnect.enabled) return;
    if (this.reconnectAttempts >= this.config.reconnect.maxAttempts) return;
    this.scheduleReconnect();
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);

    this.reconnectAttempts++;
    this.emit('reconnect', {
      attempt: this.reconnectAttempts,
      maxAttempts: this.config.reconnect.maxAttempts,
    });

    this.reconnectTimer = setTimeout(
      () => this.connect(),
      this.config.reconnect.delayMs,
    );
  }

  disconnect() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.setStatus('disconnected');
  }

  getCurrentSnapshot(): OrderbookSnapshot | null {
    return this.createSnapshot();
  }

  addToHistory(snapshot: OrderbookSnapshot) {
    this.history.push(snapshot);
  }

  getHistory() {
    return this.history;
  }

  clearHistory() {
    this.history.clear();
  }

  getTimeSinceLastUpdate(): number {
    return Date.now() - this.lastUpdateTime;
  }

  destroy() {
    this.disconnect();
    this.pipeline.destroy();
    this.removeAllListeners();
    this.asksMap.clear();
    this.bidsMap.clear();
    this.history.clear();
  }
}
