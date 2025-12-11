import { BaseManager, type Logger } from '../base';
import {
  OrderbookStatusEventKey,
  type OrderbookStatusEventMap,
} from './events';
import type { ConnectionStatus, IOrderbookStatus } from './types';

/**
 * Orderbook manages market depth updates from Kraken.
 */
export class OrderbookStatusManager
  extends BaseManager<OrderbookStatusEventMap>
  implements IOrderbookStatus
{
  private _status: ConnectionStatus;
  private _error: Error | null;

  constructor(logger: Logger) {
    super(logger, 'OrderbookStatus');
    this._error = null;
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
      this.emit(OrderbookStatusEventKey.Error, value);
    }
  }

  private emitStatusUpdate(value: ConnectionStatus) {
    this.emit(OrderbookStatusEventKey.StatusUpdate, value);
    switch (value) {
      case 'connecting':
        this.emit(
          OrderbookStatusEventKey.StatusConnectingUpdate,
          this.connecting,
        );
        break;
      case 'connected':
        this.emit(
          OrderbookStatusEventKey.StatusConnectedUpdate,
          this.connected,
        );
        break;
      case 'disconnected':
        this.emit(
          OrderbookStatusEventKey.StatusDisconnectedUpdate,
          this.disconnected,
        );
        break;
    }
  }

  onUpdateStatus = this.createListener(OrderbookStatusEventKey.StatusUpdate);
  onUpdateStatusConnected = this.createListener(
    OrderbookStatusEventKey.StatusConnectedUpdate,
  );
  onUpdateStatusDisconnected = this.createListener(
    OrderbookStatusEventKey.StatusDisconnectedUpdate,
  );
  onUpdateStatusConnecting = this.createListener(
    OrderbookStatusEventKey.StatusConnectingUpdate,
  );
  onError = this.createListener(OrderbookStatusEventKey.Error);
}
