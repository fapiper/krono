'use client';

import { useOrderbookConfig } from '@krono/hooks';
import { Switch } from '@krono/ui/components/ui/switch';
import { OrderbookSettingsRow, type OrderbookSettingsRowProps } from './row';

export type OrderbookSettingsHistorySwitchProps = Omit<
  OrderbookSettingsRowProps,
  'label' | 'control'
>;

export function OrderbookSettingsHistorySwitch(
  props: OrderbookSettingsHistorySwitchProps,
) {
  const { historyEnabled, setHistoryEnabled } = useOrderbookConfig();

  return (
    <OrderbookSettingsRow
      label="Store History"
      description="Keep a history buffer of orderbook updates"
      control={
        <Switch
          id="history"
          checked={historyEnabled}
          onCheckedChange={setHistoryEnabled}
        />
      }
      {...props}
    />
  );
}
