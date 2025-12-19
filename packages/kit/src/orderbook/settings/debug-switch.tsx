'use client';

import { useOrderbookConfig } from '@krono/hooks';
import { Switch } from '@krono/ui/components/ui/switch';
import { OrderbookSettingsRow } from './row';
import type { OrderbookSettingsBaseProps } from './types';

export type OrderbookSettingsDebugSwitchProps = OrderbookSettingsBaseProps;

export function OrderbookSettingsDebugSwitch({
  className,
  ...props
}: OrderbookSettingsDebugSwitchProps) {
  const { debug, setDebug } = useOrderbookConfig();

  return (
    <OrderbookSettingsRow
      label="Debug Mode"
      description="Enable logging and debug information"
      className={className}
      {...props}
      control={<Switch id="debug" checked={debug} onCheckedChange={setDebug} />}
    />
  );
}
