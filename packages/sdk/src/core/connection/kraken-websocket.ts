import { Logger } from '../base';
import { mergeDeep } from '../utils';
import type {
  InternalKrakenWebsocketConfig,
  KrakenHandlerMap,
  KrakenMessage,
  KrakenSubscription,
  KrakenWebsocketConfig,
  WebsocketManager,
} from './types';
import { WebsocketConnection } from './websocket-connection';

export const defaultConfig: InternalKrakenWebsocketConfig = {
  debug: false,
};

export class KrakenWebsocket implements WebsocketManager {
  private readonly subscription: KrakenSubscription;
  private isConnected = false;
  private logger: Logger;
  private readonly connection: WebsocketConnection;

  private readonly config: InternalKrakenWebsocketConfig;

  private handlers: {
    [K in keyof KrakenHandlerMap]: KrakenHandlerMap[K][];
  } = {
    message: [],
    error: [],
    close: [],
  };

  constructor(
    subscription: KrakenSubscription,
    config?: KrakenWebsocketConfig,
  ) {
    this.subscription = subscription;
    this.config = mergeDeep(defaultConfig, config ?? {});
    this.logger = new Logger({
      enabled: this.config.debug,
      prefix: 'Kraken WS',
    });
    this.connection = new WebsocketConnection(
      'wss://ws.kraken.com/v2',
      config?.connection,
    );
  }

  async connect(): Promise<void> {
    this.connection.create(
      this.onOpen.bind(this),
      this.onClose.bind(this),
      this.onError.bind(this),
      this.onMessage.bind(this),
    );
  }

  private onOpen(): void {
    this.logger.info('Connected');
    this.connection.send(this.subscription);
    this.isConnected = true;
  }

  private onClose(event: CloseEvent): void {
    this.logger.info('Closed', event.code, event.reason);
    this.isConnected = false;

    for (const fn of this.handlers.close) {
      fn();
    }
  }

  private onError(event: Event): void {
    const error = new Error('WebSocket error');
    this.logger.error('Error', event);

    for (const fn of this.handlers.error) {
      fn(error);
    }
  }

  private onMessage(event: MessageEvent): void {
    try {
      const message: KrakenMessage = JSON.parse(event.data);

      if (message.channel === 'heartbeat') return;
      if (message.channel === 'status') {
        this.logger.info('Status', message);
        return;
      }

      for (const fn of this.handlers.message) {
        fn(message);
      }
    } catch {
      const error = new Error('JSON parse failed');
      this.logger.error(error);
      for (const fn of this.handlers.error) {
        fn(error);
      }
    }
  }

  disconnect(): void {
    if (this.isConnected) {
      const unsubscribeMessage = {
        method: 'unsubscribe',
        params: this.subscription.params,
      };

      this.connection.send(unsubscribeMessage);
    }
    this.connection.close();
    this.isConnected = false;
  }

  on<K extends keyof KrakenHandlerMap>(
    event: K,
    handler: KrakenHandlerMap[K],
  ): () => void {
    const list = this.handlers[event];

    list.push(handler);

    return () => {
      const idx = list.indexOf(handler);
      if (idx > -1) list.splice(idx, 1);
    };
  }
}
