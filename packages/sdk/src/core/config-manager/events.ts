import type { IOrderbookConfig } from './types';

export const OrderbookConfigEventKey = {
  ConfigUpdate: 'update:config',
  ConfigSymbolUpdate: 'update:config:symbol',
  ConfigDepthUpdate: 'update:config:depth',
  ConfigMaxHistoryLengthUpdate: 'update:config:max_history_length',
  ConfigHistoryEnabledUpdate: 'update:config:history_enabled',
  ConfigSpreadGroupingUpdate: 'update:config:spread_grouping',
  ConfigDebugUpdate: 'update:config:debug',
  ConfigThrottleMsUpdate: 'update:config:throttle_ms',
  ConfigDebounceMsUpdate: 'update:config:debounce_ms',
  ConfigReconnectUpdate: 'update:config:reconnect',
} as const;

export type OrderbookConfigEventKey =
  (typeof OrderbookConfigEventKey)[keyof typeof OrderbookConfigEventKey];

export type OrderbookConfigEventMap = {
  [OrderbookConfigEventKey.ConfigUpdate]: IOrderbookConfig;
  [OrderbookConfigEventKey.ConfigSymbolUpdate]: IOrderbookConfig['symbol'];
  [OrderbookConfigEventKey.ConfigDepthUpdate]: IOrderbookConfig['depth'];
  [OrderbookConfigEventKey.ConfigMaxHistoryLengthUpdate]: IOrderbookConfig['maxHistoryLength'];
  [OrderbookConfigEventKey.ConfigHistoryEnabledUpdate]: IOrderbookConfig['historyEnabled'];
  [OrderbookConfigEventKey.ConfigSpreadGroupingUpdate]: IOrderbookConfig['spreadGrouping'];
  [OrderbookConfigEventKey.ConfigDebugUpdate]: IOrderbookConfig['debug'];
  [OrderbookConfigEventKey.ConfigThrottleMsUpdate]: IOrderbookConfig['throttleMs'];
  [OrderbookConfigEventKey.ConfigDebounceMsUpdate]: IOrderbookConfig['debounceMs'];
  [OrderbookConfigEventKey.ConfigReconnectUpdate]: IOrderbookConfig['reconnect'];
};
