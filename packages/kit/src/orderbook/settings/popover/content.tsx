import { PopoverContent } from '@krono/ui/components/ui/popover';
import { Separator } from '@krono/ui/components/ui/separator';
import { cn } from '@krono/ui/lib';
import type { ComponentProps } from 'react';
import { OrderbookSettingsDebounceInput } from '../debounce-input';
import { OrderbookSettingsDebugSwitch } from '../debug-switch';
import { OrderbookSettingsDepthSelect } from '../depth-select';
import { OrderbookSettingsHistorySwitch } from '../history-switch';
import { OrderbookSettingsMaxHistoryInput } from '../max-history-input';
import { OrderbookSettingsSpreadSelect } from '../spread-select';
import { OrderbookSettingsThrottleInput } from '../throttle-input';

export type OrderbookSettingsPopoverContentProps = ComponentProps<
  typeof PopoverContent
>;

export function OrderbookSettingsPopoverContent({
  children,
  className,
  ...props
}: OrderbookSettingsPopoverContentProps) {
  return (
    <PopoverContent className={cn('w-88 mr-4', className)} {...props}>
      {children ? (
        children
      ) : (
        <div className="grid gap-y-2">
          <div>
            <h3 className="font-semibold text-base mb-1">Settings</h3>
            <p className="text-muted-foreground text-sm">
              Configure orderbook behavior and display options
            </p>
          </div>

          <Separator orientation="horizontal" />

          <OrderbookSettingsDebugSwitch />
          <OrderbookSettingsHistorySwitch />

          <Separator orientation="horizontal" />

          <OrderbookSettingsDepthSelect />
          <OrderbookSettingsSpreadSelect />

          <OrderbookSettingsMaxHistoryInput />
          <OrderbookSettingsThrottleInput />
          <OrderbookSettingsDebounceInput />
        </div>
      )}
    </PopoverContent>
  );
}
