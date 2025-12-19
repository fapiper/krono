'use client';

import { useOrderbookConfig } from '@krono/hooks';
import { Button } from '@krono/ui/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@krono/ui/components/ui/select';
import { useEffect, useState } from 'react';
import { OrderbookSettingsRow } from './row';
import type { OrderbookSettingsBaseProps } from './types';

export type OrderbookSettingsSpreadSelectProps = OrderbookSettingsBaseProps;

export function OrderbookSettingsSpreadSelect({
  className,
  ...props
}: OrderbookSettingsSpreadSelectProps) {
  const { spreadGrouping, setSpreadGrouping, groupingOptions } =
    useOrderbookConfig();

  const [value, setValue] = useState(String(spreadGrouping));

  useEffect(() => {
    setValue(String(spreadGrouping));
  }, [spreadGrouping]);

  return (
    <OrderbookSettingsRow
      label="Grouping"
      description="Price aggregation level"
      className={className}
      {...props}
      control={
        <>
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger className="h-9 w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {groupingOptions.map((opt) => (
                <SelectItem key={opt} value={String(opt)}>
                  {opt < 1 ? opt.toFixed(4) : opt}
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
