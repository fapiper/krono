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

export type OrderbookSettingsDepthSelectProps = Omit<
  OrderbookSettingsRowProps,
  'label' | 'control'
>;

export function OrderbookSettingsDepthSelect(
  props: OrderbookSettingsDepthSelectProps,
) {
  const { depth, setDepth } = useOrderbookConfig();
  const options = ['10', '25', '100', '500', '1000'];

  return (
    <OrderbookSettingsRow
      label="Orderbook Depth"
      description="Number of price levels to request"
      control={
        <Select
          value={String(depth)}
          onValueChange={(val) =>
            setDepth(Number(val) as 1000 | 100 | 10 | 25 | 500)
          }
        >
          <SelectTrigger className="h-8 w-24">
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
      }
      {...props}
    />
  );
}
