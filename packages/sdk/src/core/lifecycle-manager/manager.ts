import { BaseManager, type Logger } from '../base';
import { TypedEventEmitter } from '../events';
import {
  OrderbookLifecycleEventKey,
  type OrderbookLifecycleEventMap,
} from './events';
import type { ConnectionStatus, IOrderbookLifecycle } from './types';

/**
 * Orderbook manages market depth updates from Kraken.
 */
export class OrderbookLifecycleManager
  extends BaseManager<OrderbookLifecycleEventMap>
  implements IOrderbookLifecycle
{
  private _status: ConnectionStatus;
  private _error?: Error;

  constructor(logger: Logger) {
    super(logger, 'OrderbookLifecycle');
    this._status = 'disconnected';
  }

  /**
   * Returns configured trading symbol.
   */
  get status(): ConnectionStatus {
    if (!this._error) return 'error';
    return this._status;
  }

  /**
   * Updates symbol and reconnects.
   */
  set status(value: ConnectionStatus) {
    if (this._status !== value && value !== 'error') {
      this._status = value;
      this.log.debug(`Status updated to ${value}.`);
      this.emitStatusUpdate(value);
    }
  }

  /**
   * Returns disconnected.
   */
  get disconnected() {
    return this._status === 'disconnected';
  }

  /**
   * Returns connected.
   */
  get connected() {
    return this._status === 'connected';
  }

  /**
   * Returns connecting.
   */
  get connecting() {
    return this._status === 'connecting';
  }

  /**
   * Returns error.
   */
  get error() {
    return this._error;
  }

  /**
   * Sets connecting.
   */
  set error(value) {
    if (this._error !== value) {
      this._error = value;
      this.log.debug(`Error updated to ${JSON.stringify(value)}.`);
      this.emit(OrderbookLifecycleEventKey.Error, value);
    }
  }

  private emitStatusUpdate(value: ConnectionStatus) {
    this.emit(OrderbookLifecycleEventKey.StatusUpdate, value);
    switch (value) {
      case 'connecting':
        this.emit(
          OrderbookLifecycleEventKey.StatusConnectingUpdate,
          this.connecting,
        );
        break;
      case 'connected':
        this.emit(
          OrderbookLifecycleEventKey.StatusConnectedUpdate,
          this.connected,
        );
        break;
      case 'disconnected':
        this.emit(
          OrderbookLifecycleEventKey.StatusDisconnectedUpdate,
          this.disconnected,
        );
        break;
    }
  }

  onUpdateStatus = this.createListener(OrderbookLifecycleEventKey.StatusUpdate);
  onUpdateStatusConnected = this.createListener(
    OrderbookLifecycleEventKey.StatusConnectedUpdate,
  );
  onUpdateStatusDisconnected = this.createListener(
    OrderbookLifecycleEventKey.StatusDisconnectedUpdate,
  );
  onUpdateStatusConnecting = this.createListener(
    OrderbookLifecycleEventKey.StatusConnectingUpdate,
  );
  onError = this.createListener(OrderbookLifecycleEventKey.Error);
}
