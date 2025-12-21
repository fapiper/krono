'use client';

import { useOrderbookConfig } from '@krono/hooks';
import { Button } from '@krono/ui/components/ui/button';
import { Input } from '@krono/ui/components/ui/input';
import { OrderbookSettingsRow, type OrderbookSettingsRowProps } from './row';
import { useBufferedSetting } from './use-buffered-setting';

export type OrderbookSettingsThrottleInputProps = Omit<
  OrderbookSettingsRowProps,
  'label' | 'control'
>;

export function OrderbookSettingsThrottleInput(
  props: OrderbookSettingsThrottleInputProps,
) {
  const { throttleMs, setThrottle } = useOrderbookConfig();
  const { localValue, setLocalValue, apply, isValid, isDirty } =
    useBufferedSetting(throttleMs, (prev = 0) =>
      setThrottle(prev > 0 ? prev : undefined),
    );

  return (
    <OrderbookSettingsRow
      label="Throttle (ms)"
      description="Limit update frequency to improve performance"
      control={
        <>
          <Input
            type="number"
            value={localValue}
            className="h-9 w-24"
            onChange={(e) => setLocalValue(e.target.value)}
          />
          <Button size="sm" onClick={apply} disabled={!isValid || !isDirty}>
            Apply
          </Button>
        </>
      }
      {...props}
    />
  );
}
