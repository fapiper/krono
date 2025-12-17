'use client';

import { useOrderbookConfig } from '@krono/hooks';
import { Switch } from '@krono/ui/components/ui/switch';
import { OrderbookSettingsRow } from './row';
import type { OrderbookSettingsBaseProps } from './types';

export type OrderbookSettingsHistorySwitchProps = OrderbookSettingsBaseProps;

export function OrderbookSettingsHistorySwitch({
  className,
  ...props
}: OrderbookSettingsHistorySwitchProps) {
  const { historyEnabled, setHistoryEnabled } = useOrderbookConfig();

  return (
    <OrderbookSettingsRow
      label="Store History"
      description="Keep a history buffer of orderbook updates"
      className={className}
      {...props}
      control={
        <Switch
          id="history"
          checked={historyEnabled}
          onCheckedChange={setHistoryEnabled}
        />
      }
    />
  );
}
