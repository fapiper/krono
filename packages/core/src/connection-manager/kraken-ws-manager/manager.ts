import { BaseManager, type Logger } from '../../base';
import {
  KrakenWebsocketEventKey,
  type KrakenWebsocketEventMap,
} from './events';
import type {
  KrakenMessage,
  KrakenSubscription,
  KrakenWebsocketConfig,
  WebsocketManager,
} from './types';
import { WebsocketConnection } from './websocket-connection';

export class KrakenWSManager
  extends BaseManager<KrakenWebsocketEventMap>
  implements WebsocketManager
{
  private readonly connection: WebsocketConnection;
  private _subscription?: KrakenSubscription;
  private _connected = false;

  constructor(
    logger: Logger,
    config?: KrakenWebsocketConfig,
    subscription?: KrakenSubscription,
  ) {
    super(logger, 'KrakenWS');
    this._subscription = subscription;

    this.connection = new WebsocketConnection(
      'wss://ws.kraken.com/v2',
      config?.connection,
    );

    // Auto-connect if subscription was passed in constructor
    if (this._subscription) {
      this.connect(this._subscription).catch((err) => {
        this.log.error('Auto-connect failed in constructor', err);
      });
    }
  }

  /**
   * Establishes the websocket connection.
   * If a subscription is provided, it updates the internal subscription state.
   */
  async connect(subscription?: KrakenSubscription): Promise<void> {
    if (subscription) {
      this._subscription = subscription;
    }

    if (!this._subscription) {
      const error = new Error('Cannot connect: No subscription provided.');
      this.emit(KrakenWebsocketEventKey.Error, error);
      throw error;
    }

    // If already connected, we might need to reconnect if subscription changed,
    // or just return if it's identical. For safety, we disconnect first.
    if (this._connected) {
      this.log.debug('Reconnect requested, disconnecting current session...');
      this.disconnect();
    }

    this.log.info('Connecting to Kraken...');

    try {
      this.connection.create(
        this.handleOpen.bind(this),
        this.handleClose.bind(this),
        this.handleError.bind(this),
        this.handleMessage.bind(this),
      );
    } catch (error) {
      // Catch synchronous creation errors
      this.handleError(
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }

  /**
   * Closes the connection.
   */
  disconnect(): void {
    if (this._connected && this._subscription) {
      // Attempt to send unsubscribe message gracefully
      try {
        const unsubscribeMessage = {
          method: 'unsubscribe',
          params: this._subscription.params,
        };
        this.connection.send(unsubscribeMessage);
      } catch (e) {
        this.log.debug('Failed to send unsubscribe message', e);
      }
    }

    this.connection.close();
    // State cleanup happens in onClose
  }

  get connected(): boolean {
    return this._connected;
  }

  private handleOpen(): void {
    if (!this._subscription) return;

    this.log.info('Connection opened, sending subscription.');
    this.connection.send(this._subscription);

    this._connected = true;
    this.emit(KrakenWebsocketEventKey.Connected, this._subscription);
  }

  private handleClose(event: CloseEvent): void {
    if (this._connected) {
      this.log.info(`Connection closed: ${event.code} - ${event.reason}`);
    }

    this._connected = false;
    this.emit(KrakenWebsocketEventKey.Disconnected, this._subscription);
  }

  private handleError(event: Event | Error): void {
    const isError = event instanceof Error;
    const error = isError ? event : new Error('WebSocket error occurred');
    this.emit(KrakenWebsocketEventKey.Error, error);
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const message: KrakenMessage = JSON.parse(event.data);

      if (message.channel === 'heartbeat') return;

      if (message.channel === 'status') {
        this.log.debug('System Status:', message);
        return;
      }

      this.emit(KrakenWebsocketEventKey.Message, message);
    } catch (e) {
      const error = new Error(`JSON parse failed: ${e}`);
      this.log.error(error);
      this.emit(KrakenWebsocketEventKey.Error, error);
    }
  }

  onConnected = this.createListener(KrakenWebsocketEventKey.Connected);
  onDisconnected = this.createListener(KrakenWebsocketEventKey.Disconnected);
  onError = this.createListener(KrakenWebsocketEventKey.Error);
  onMessage = this.createListener(KrakenWebsocketEventKey.Message);
}
