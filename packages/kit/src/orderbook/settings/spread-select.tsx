'use client';

import { useOrderbookConfig } from '@krono/hooks';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@krono/ui/components/ui/select';
import { OrderbookSettingsRow, type OrderbookSettingsRowProps } from './row';

export type OrderbookSettingsSpreadSelectProps = Omit<
  OrderbookSettingsRowProps,
  'label' | 'control'
>;

export function OrderbookSettingsSpreadSelect(
  props: OrderbookSettingsSpreadSelectProps,
) {
  const { spreadGrouping, setSpreadGrouping, groupingOptions } =
    useOrderbookConfig();

  return (
    <OrderbookSettingsRow
      label="Grouping"
      description="Price aggregation level"
      control={
        <Select
          value={String(spreadGrouping)}
          onValueChange={(val) => setSpreadGrouping(Number(val))}
        >
          <SelectTrigger className="h-8 w-24">
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
      }
      {...props}
    />
  );
}
