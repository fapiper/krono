'use client';

import { useOrderbookConfig } from '@krono/hooks';
import { Switch } from '@krono/ui/components/ui/switch';
import { OrderbookSettingsRow, type OrderbookSettingsRowProps } from './row';

export type OrderbookSettingsDebugSwitchProps = Omit<
  OrderbookSettingsRowProps,
  'label' | 'control'
>;

export function OrderbookSettingsDebugSwitch(
  props: OrderbookSettingsDebugSwitchProps,
) {
  const { debug, setDebug } = useOrderbookConfig();

  return (
    <OrderbookSettingsRow
      label="Debug Mode"
      description="Enable logging and debug information"
      control={<Switch id="debug" checked={debug} onCheckedChange={setDebug} />}
      {...props}
    />
  );
}
