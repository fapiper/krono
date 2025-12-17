'use client';

import { Popover } from '@krono/ui/components/ui/popover';
import type { ComponentProps } from 'react';
import { OrderbookSettingsPopoverContent } from './content';
import { OrderbookSettingsPopoverTrigger } from './trigger';

export type OrderbookSettingsPopoverRootProps = ComponentProps<typeof Popover>;

export function OrderbookSettingsPopoverRoot({
  children,
  ...props
}: OrderbookSettingsPopoverRootProps) {
  if (children) {
    return <Popover {...props}>{children}</Popover>;
  }

  return (
    <Popover {...props}>
      <OrderbookSettingsPopoverTrigger />
      <OrderbookSettingsPopoverContent />
    </Popover>
  );
}
