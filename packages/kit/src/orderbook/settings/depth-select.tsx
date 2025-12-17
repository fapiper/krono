'use client';

import { useOrderbookConfig } from '@krono/hooks';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@krono/ui/components/ui/select';
import { Button } from '@ui/components/ui/button';
import { useState } from 'react';
import { OrderbookSettingsRow } from './row';
import type { OrderbookSettingsBaseProps } from './types';

export type OrderbookSettingsDepthSelectProps = OrderbookSettingsBaseProps;

export function OrderbookSettingsDepthSelect({
  className,
  ...props
}: OrderbookSettingsDepthSelectProps) {
  const { depth, setDepth } = useOrderbookConfig();
  const [value, setValue] = useState(String(depth));
  const options = ['10', '25', '100', '500', '1000'];

  return (
    <OrderbookSettingsRow
      label="Orderbook Depth"
      description="Number of price levels to request"
      className={className}
      {...props}
      control={
        <>
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger className="h-9 w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="w-32">
              {options.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            onClick={() =>
              setDepth(Number(value) as 1000 | 100 | 10 | 25 | 500)
            }
          >
            Apply
          </Button>
        </>
      }
    />
  );
}
