'use client';

import { useOrderbookConfig } from '@krono/hooks';
import { Button } from '@krono/ui/components/ui/button';
import { Input } from '@krono/ui/components/ui/input';
import { useState } from 'react';
import { OrderbookSettingsRow } from './row';
import type { OrderbookSettingsBaseProps } from './types';

export type OrderbookSettingsMaxHistoryInputProps = OrderbookSettingsBaseProps;

export function OrderbookSettingsMaxHistoryInput({
  className,
  ...props
}: OrderbookSettingsMaxHistoryInputProps) {
  const { maxHistoryLength, setMaxHistoryLength } = useOrderbookConfig();
  const [value, setValue] = useState(String(maxHistoryLength));
  const isValid = Number(value) >= 1;

  return (
    <OrderbookSettingsRow
      label="Max History Size"
      description="Maximum number of entries in the history buffer"
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
            onClick={() => setMaxHistoryLength(Number(value))}
            disabled={!isValid}
          >
            Apply
          </Button>
        </>
      }
    />
  );
}
