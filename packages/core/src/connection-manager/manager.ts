import { BaseManager, type Logger } from '../base';
import type { OrderbookConfigManager } from '../config-manager';
import type { OrderbookStatusManager } from '../status-manager';
import {
  OrderbookConnectionEventKey,
  type OrderbookConnectionEventMap,
} from './events';
import { type KrakenSubscription, KrakenWSManager } from './kraken-ws-manager';
import type { IOrderbookConnection } from './types';

/**
 * Translates Kraken websocket messages into
 * orderbook domain events.
 *
 * @internal
 */
export class OrderbookConnectionManager
  extends BaseManager<OrderbookConnectionEventMap>
  implements IOrderbookConnection
{
  private socket: KrakenWSManager;
  private configManager: OrderbookConfigManager;
  private statusManager: OrderbookStatusManager;

  /**
   * @param logger Shared logger
   * @param configManager Runtime config
   * @param statusManager Connection status holder
   */
  constructor(
    logger: Logger,
    configManager: OrderbookConfigManager,
    statusManager: OrderbookStatusManager,
  ) {
    super(logger, 'OrderbookConnection');
    this.configManager = configManager;
    this.statusManager = statusManager;

    this.socket = new KrakenWSManager(logger, {
      debug: configManager.debug,
    });

    this.setupSocketListeners();
  }

  /**
   * Opens websocket and subscribes to orderbook feed
   */
  async connect(): Promise<void> {
    this.statusManager.status = 'connecting';

    const subscription: KrakenSubscription = {
      method: 'subscribe',
      params: {
        channel: 'book',
        symbol: [this.configManager.symbol],
        snapshot: true,
        depth: this.configManager.depth,
      },
    };

    try {
      await this.socket.connect(subscription);
    } catch (e) {
      this.statusManager.error = e instanceof Error ? e : new Error(String(e));
    }
  }

  /**
   * Closes the underlying socket.
   */
  disconnect(): void {
    this.socket.disconnect();
    this.statusManager.status = 'disconnected';
  }

  /**
   * Maps generic socket events to Orderbook domain logic.
   */
  private setupSocketListeners() {
    this.socket.onConnected(() => {
      this.statusManager.status = 'connected';
    });

    this.socket.onDisconnected(() => {
      if (this.statusManager.status !== 'error') {
        this.statusManager.status = 'disconnected';
      }
    });

    this.socket.onError((e) => {
      this.statusManager.error = e;
    });

    this.socket.onMessage((message) => {
      if (message.channel !== 'book' || !message.data) {
        return;
      }

      const data = message.data[0];
      const targetSymbol = this.configManager.symbol;

      if (!data || data.symbol !== targetSymbol) {
        return;
      }

      switch (message.type) {
        case 'snapshot':
          this.emit(OrderbookConnectionEventKey.Snapshot, data);
          break;
        case 'update':
          this.emit(OrderbookConnectionEventKey.Update, data);
          break;
      }
    });
  }

  // Event helpers

  onSnapshot = this.createListener(OrderbookConnectionEventKey.Snapshot);
  onUpdate = this.createListener(OrderbookConnectionEventKey.Update);
}
