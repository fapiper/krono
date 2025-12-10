import type { IOrderbookConfig, OrderbookConfigEventMap } from './config';
import { TypedEventEmitter } from './events';
import type { ConnectionStatus, OrderbookData } from './types';

export enum OrderbookEventKey {
  Data = 'data',
  DataUpdate = 'update:data',
  HistoryUpdate = 'update:history',
  RawUpdate = 'update:raw',
  StatusUpdate = 'update:status',
  ConfigUpdate = 'update:config',
  UpdateConfigSymbol = 'update:config:symbol',
  UpdateConfigDepth = 'update:config:depth',
  UpdateConfigMaxHistoryLength = 'update:config:max_history_length',
  UpdateConfigHistoryEnabled = 'update:config:history_enabled',
  UpdateConfigSpreadGrouping = 'update:config:spread_grouping',
  UpdateConfigDebug = 'update:config:debug',
  UpdateConfigThrottleMs = 'update:config:throttle_ms',
  UpdateConfigDebounceMs = 'update:config:debounce_ms',
  UpdateConfigReconnect = 'update:config:reconnect',
  Error = 'error',
}

export type OrderbookEventMap = OrderbookConfigEventMap & {
  [OrderbookEventKey.ConfigUpdate]: IOrderbookConfig;
  [OrderbookEventKey.Data]: OrderbookData;
  [OrderbookEventKey.DataUpdate]: OrderbookData;
  [OrderbookEventKey.HistoryUpdate]: OrderbookData[];
  [OrderbookEventKey.RawUpdate]: OrderbookData;
  [OrderbookEventKey.StatusUpdate]: ConnectionStatus;
  [OrderbookEventKey.Error]: Error;
};

export class OrderbookEventEmitter extends TypedEventEmitter<OrderbookEventMap> {
  protected emitStatusUpdate(status: ConnectionStatus) {
    this.emit(OrderbookEventKey.StatusUpdate, status);
  }

  protected emitRawUpdate(data: OrderbookData) {
    this.emit(OrderbookEventKey.RawUpdate, data);
  }

  protected emitDataUpdate(data: OrderbookData) {
    this.emit(OrderbookEventKey.DataUpdate, data);
  }

  protected emitHistoryUpdate(history: OrderbookData[]) {
    this.emit(OrderbookEventKey.HistoryUpdate, history);
  }

  protected emitConfigUpdate(config: IOrderbookConfig) {
    this.emit(OrderbookEventKey.ConfigUpdate, config);
  }

  protected emitError(error: Error) {
    this.emit(OrderbookEventKey.Error, error);
  }

  onData = this.createListener(OrderbookEventKey.Data);
  onDataUpdate = this.createListener(OrderbookEventKey.DataUpdate);
  onHistoryUpdate = this.createListener(OrderbookEventKey.HistoryUpdate);
  onRawUpdate = this.createListener(OrderbookEventKey.RawUpdate);
  onStatusUpdate = this.createListener(OrderbookEventKey.StatusUpdate);
  onConfigUpdate = this.createListener(OrderbookEventKey.ConfigUpdate);
  onError = this.createListener(OrderbookEventKey.Error);
}
