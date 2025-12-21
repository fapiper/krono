'use client';

import {
  OrderbookSettings,
  OrderbookSettingsPopover,
  type OrderbookSettingsPopoverTriggerProps,
} from '@krono/kit';
import { cn } from '@krono/ui/lib';
import Link from 'next/link';
import type { HTMLAttributes } from 'react';

export type LayoutHeaderContentProps = HTMLAttributes<HTMLDivElement> & {
  settingsTriggerProps?: OrderbookSettingsPopoverTriggerProps;
};

export default function LayoutHeaderContent({
  className,
  children,
  settingsTriggerProps,
  ...props
}: LayoutHeaderContentProps) {
  return (
    <div className={cn(className)} {...props}>
      <Link
        href={'/about'}
        className={
          'text-foreground/60 transition-color ease-in-out duration-200 font-medium hover:text-foreground visited:text-foreground'
        }
      >
        About
      </Link>
      <Link
        href={'/docs'}
        className={
          'text-foreground/60 transition-color ease-in-out duration-200 font-medium hover:text-foreground visited:text-foreground'
        }
      >
        Documentation
      </Link>
      <OrderbookSettingsPopover.Root>
        <OrderbookSettingsPopover.Trigger {...settingsTriggerProps} />

        <OrderbookSettingsPopover.Content className={'md:mr-4'}>
          <div>
            <h3 className="font-semibold">Feed Settings</h3>
            <p className={'text-muted-foreground text-sm'}>
              Configure orderbook behavior and display options
            </p>
          </div>

          <OrderbookSettings.Separator className="my-2" />

          <OrderbookSettings.HistorySwitch />
          <OrderbookSettings.DebugSwitch />

          <OrderbookSettings.Separator className="my-2" />

          <OrderbookSettings.DepthSelect />
          <OrderbookSettings.SpreadSelect />

          <OrderbookSettings.Separator className="my-2" />

          <OrderbookSettings.ThrottleInput />
          <OrderbookSettings.DebounceInput />
        </OrderbookSettingsPopover.Content>
      </OrderbookSettingsPopover.Root>
    </div>
  );
}
