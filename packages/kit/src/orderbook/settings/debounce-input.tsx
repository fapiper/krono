'use client';

import { useOrderbookConfig } from '@krono/hooks';
import { Button } from '@krono/ui/components/ui/button';
import { Input } from '@krono/ui/components/ui/input';
import { OrderbookSettingsRow, type OrderbookSettingsRowProps } from './row';
import { useBufferedSetting } from './use-buffered-setting';

export type OrderbookSettingsDebounceInputProps = Omit<
  OrderbookSettingsRowProps,
  'label' | 'control'
>;

export function OrderbookSettingsDebounceInput(
  props: OrderbookSettingsDebounceInputProps,
) {
  const { debounceMs, setDebounce } = useOrderbookConfig();
  const { localValue, setLocalValue, apply, isValid, isDirty } =
    useBufferedSetting(debounceMs, (prev = 0) =>
      setDebounce(prev > 0 ? prev : undefined),
    );

  return (
    <OrderbookSettingsRow
      label="Debounce (ms)"
      description="Delay updates until input stabilizes"
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
