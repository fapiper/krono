import { type Websocket, WebsocketBuilder } from 'websocket-ts';
import { Logger } from '../base';
import type {
  KrakenHandlerMap,
  KrakenMessage,
  KrakenSubscription,
  WebSocketManager,
} from './types';

export class KrakenWebSocket implements WebSocketManager {
  private ws: Websocket | null = null;
  private isConnected = false;
  private logger: Logger;

  private handlers: {
    [K in keyof KrakenHandlerMap]: KrakenHandlerMap[K][];
  } = {
    message: [],
    error: [],
    close: [],
  };

  constructor(
    private url: string,
    private subscription: KrakenSubscription,
    debug = false,
  ) {
    this.logger = new Logger({
      enabled: debug,
      prefix: 'Kraken WS',
    });
  }

  async connect(): Promise<void> {
    const builder = new WebsocketBuilder(this.url)
      .onOpen(() => this.onOpen())
      .onClose((_, event) => this.onClose(event))
      .onError((_, event) => this.onError(event))
      .onMessage((_, event) => this.onMessage(event));

    this.ws = builder.build();
  }

  private onOpen(): void {
    this.logger.info('Connected');

    this.send(this.subscription);
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
    let msg: KrakenMessage;

    try {
      msg = JSON.parse(event.data);
    } catch (error) {
      const e = new Error('JSON parse failed');
      this.logger.error(e);
      for (const fn of this.handlers.error) {
        fn(e);
      }
      return;
    }

    if (msg.channel === 'heartbeat') return;

    if (msg.channel === 'status') {
      this.logger.info('Status', msg);
      return;
    }
    for (const fn of this.handlers.message) {
      fn(msg);
    }
  }

  disconnect(): void {
    if (!this.ws) return;

    if (this.isConnected) {
      this.send({
        method: 'unsubscribe',
        params: this.subscription.params,
      });
    }

    this.ws.close(1000, 'Client disconnected');

    this.ws = null;
    this.isConnected = false;
  }

  private send(data: unknown): void {
    if (!this.ws) return;
    try {
      this.ws.send(JSON.stringify(data));
    } catch (err) {
      this.logger.error('Send failed', err);
    }
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
