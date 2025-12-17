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

export type OrderbookSettingsSpreadSelectProps = OrderbookSettingsBaseProps;

export function OrderbookSettingsSpreadSelect({
  className,
  ...props
}: OrderbookSettingsSpreadSelectProps) {
  const { spreadGrouping, setSpreadGrouping } = useOrderbookConfig();
  const [value, setValue] = useState(String(spreadGrouping));
  const options = ['0.1', '0.5', '1', '2.5', '5', '10', '20', '50', '100'];

  return (
    <OrderbookSettingsRow
      label="Spread"
      description="Price level grouping interval"
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
          <Button size="sm" onClick={() => setSpreadGrouping(Number(value))}>
            Apply
          </Button>
        </>
      }
    />
  );
}
