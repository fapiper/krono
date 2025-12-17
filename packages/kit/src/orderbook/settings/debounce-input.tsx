'use client';

import { useOrderbookConfig } from '@krono/hooks';
import { Button } from '@krono/ui/components/ui/button';
import { Input } from '@krono/ui/components/ui/input';
import { useState } from 'react';
import { OrderbookSettingsRow } from './row';
import type { OrderbookSettingsBaseProps } from './types';

export type OrderbookSettingsDebounceInputProps = OrderbookSettingsBaseProps;

export function OrderbookSettingsDebounceInput({
  className,
  ...props
}: OrderbookSettingsDebounceInputProps) {
  const { debounceMs, setDebounce } = useOrderbookConfig();
  const [value, setValue] = useState(String(debounceMs ?? ''));
  const isValid = value === '' || Number(value) >= 0;

  return (
    <OrderbookSettingsRow
      label="Debounce (ms)"
      description="Delay updates until input stabilizes"
      className={className}
      {...props}
      control={
        <>
          <Input
            type="number"
            value={value}
            className="h-9 w-24"
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            size="sm"
            onClick={() => {
              const val = Number(value);
              setDebounce(val > 0 ? val : undefined);
            }}
            disabled={!isValid}
          >
            Apply
          </Button>
        </>
      }
    />
  );
}
