'use client';

import { PopoverContent } from '@krono/ui/components/ui/popover';
import { cn } from '@krono/ui/lib';
import type { ComponentPropsWithoutRef } from 'react';

export type OrderbookSettingsPopoverContentProps = ComponentPropsWithoutRef<
  typeof PopoverContent
>;

export function OrderbookSettingsPopoverContent({
  children,
  className,
  ...props
}: OrderbookSettingsPopoverContentProps) {
  return (
    <PopoverContent
      className={cn('w-96 flex flex-col gap-y-2', className)}
      {...props}
    >
      {children}
    </PopoverContent>
  );
}
