'use client';

import { useOrderbookConfig } from '@krono/hooks';
import { Button } from '@krono/ui/components/ui/button';
import { Input } from '@krono/ui/components/ui/input';
import { OrderbookSettingsRow, type OrderbookSettingsRowProps } from './row';
import { useBufferedSetting } from './use-buffered-setting';

export type OrderbookSettingsMaxHistoryInputProps = Omit<
  OrderbookSettingsRowProps,
  'label' | 'control'
>;

export function OrderbookSettingsMaxHistoryInput(
  props: OrderbookSettingsMaxHistoryInputProps,
) {
  const { maxHistoryLength, setMaxHistoryLength } = useOrderbookConfig();
  const { localValue, setLocalValue, apply, isValid, isDirty } =
    useBufferedSetting(maxHistoryLength, setMaxHistoryLength);

  return (
    <OrderbookSettingsRow
      label="Max History Size"
      description="Maximum number of entries in the history buffer"
      control={
        <>
          <Input
            type="number"
            value={localValue}
            className="h-9 w-24"
            onChange={(e) => setLocalValue(e.target.value)}
          />
          <Button
            size="sm"
            variant="secondary"
            onClick={apply}
            disabled={!isValid || !isDirty}
          >
            Apply
          </Button>
        </>
      }
      {...props}
    />
  );
}
