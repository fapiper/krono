import type { IOrderbookConfig, OrderbookConfigEventMap } from './config';
import { TypedEventEmitter } from './events';
import type { ConnectionStatus, OrderbookSnapshot } from './types';

export enum OrderbookEventKey {
  Snapshot = 'snapshot',
  UpdateSnapshot = 'update:snapshot',
  UpdateHistory = 'update:history',
  UpdateRaw = 'update:raw',
  UpdateStatus = 'update:status',
  UpdateConfig = 'update:config',
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
  [OrderbookEventKey.UpdateConfig]: IOrderbookConfig;
  [OrderbookEventKey.Snapshot]: OrderbookSnapshot;
  [OrderbookEventKey.UpdateSnapshot]: OrderbookSnapshot;
  [OrderbookEventKey.UpdateHistory]: OrderbookSnapshot[];
  [OrderbookEventKey.UpdateRaw]: OrderbookSnapshot;
  [OrderbookEventKey.UpdateStatus]: ConnectionStatus;
  [OrderbookEventKey.Error]: Error;
};

export class OrderbookEventEmitter extends TypedEventEmitter<OrderbookEventMap> {
  protected emitStatusUpdate(status: ConnectionStatus) {
    this.emit(OrderbookEventKey.UpdateStatus, status);
  }

  protected emitRawUpdate(snapshot: OrderbookSnapshot) {
    this.emit(OrderbookEventKey.UpdateRaw, snapshot);
  }

  protected emitSnapshot(snapshot: OrderbookSnapshot) {
    this.emit(OrderbookEventKey.Snapshot, snapshot);
  }

  protected emitSnapshotUpdate(snapshot: OrderbookSnapshot) {
    this.emit(OrderbookEventKey.UpdateSnapshot, snapshot);
  }

  protected emitHistoryUpdate(history: OrderbookSnapshot[]) {
    this.emit(OrderbookEventKey.UpdateHistory, history);
  }

  protected emitConfigUpdate(config: IOrderbookConfig) {
    this.emit(OrderbookEventKey.UpdateConfig, config);
  }

  protected emitError(error: Error) {
    this.emit(OrderbookEventKey.Error, error);
  }

  onSnapshot = this.createListener(OrderbookEventKey.Snapshot);
  onSnapshotUpdate = this.createListener(OrderbookEventKey.UpdateSnapshot);
  onHistoryUpdate = this.createListener(OrderbookEventKey.UpdateHistory);
  onRawUpdate = this.createListener(OrderbookEventKey.UpdateRaw);
  onStatusUpdate = this.createListener(OrderbookEventKey.UpdateStatus);
  onConfigUpdate = this.createListener(OrderbookEventKey.UpdateConfig);
  onError = this.createListener(OrderbookEventKey.Error);
}
