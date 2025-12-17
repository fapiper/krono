import { OrderbookSettingsDebounceInput } from './debounce-input';
import { OrderbookSettingsDebugSwitch } from './debug-switch';
import { OrderbookSettingsDepthSelect } from './depth-select';
import { OrderbookSettingsHistorySwitch } from './history-switch';
import { OrderbookSettingsMaxHistoryInput } from './max-history-input';
import { OrderbookSettingsRow } from './row';
import { OrderbookSettingsSpreadSelect } from './spread-select';
import { OrderbookSettingsThrottleInput } from './throttle-input';

export type { OrderbookSettingsDebounceInputProps } from './debounce-input';
export type { OrderbookSettingsDebugSwitchProps } from './debug-switch';
export type { OrderbookSettingsDepthSelectProps } from './depth-select';
export type { OrderbookSettingsHistorySwitchProps } from './history-switch';
export type { OrderbookSettingsMaxHistoryInputProps } from './max-history-input';
export * from './popover';
export type { OrderbookSettingsRowProps } from './row';
export type { OrderbookSettingsSpreadSelectProps } from './spread-select';
export type { OrderbookSettingsThrottleInputProps } from './throttle-input';
export type { OrderbookSettingsBaseProps } from './types';

export const OrderbookSettings = {
  DebounceInput: OrderbookSettingsDebounceInput,
  DebugSwitch: OrderbookSettingsDebugSwitch,
  DepthSelect: OrderbookSettingsDepthSelect,
  HistorySwitch: OrderbookSettingsHistorySwitch,
  MaxHistoryInput: OrderbookSettingsMaxHistoryInput,
  Row: OrderbookSettingsRow,
  SpreadSelect: OrderbookSettingsSpreadSelect,
  ThrottleInput: OrderbookSettingsThrottleInput,
};
