import { Popover } from '@krono/ui/components/ui/popover';
import type { ComponentPropsWithoutRef } from 'react';

export type OrderbookSettingsPopoverRootProps = ComponentPropsWithoutRef<
  typeof Popover
>;

export function OrderbookSettingsPopoverRoot({
  children,
  ...props
}: OrderbookSettingsPopoverRootProps) {
  return <Popover {...props}>{children}</Popover>;
}
