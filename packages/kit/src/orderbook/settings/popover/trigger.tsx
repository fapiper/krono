'use client';

import { Button } from '@krono/ui/components/ui/button';
import { PopoverTrigger } from '@krono/ui/components/ui/popover';
import { Settings } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

export interface OrderbookSettingsPopoverTriggerProps
  extends ComponentProps<typeof PopoverTrigger> {
  icon?: ReactNode;
}

export function OrderbookSettingsPopoverTrigger({
  children,
  className,
  icon = <Settings />,
  asChild = false,
  ...props
}: OrderbookSettingsPopoverTriggerProps) {
  if (asChild) {
    return (
      <PopoverTrigger asChild={true} className={className} {...props}>
        {children}
      </PopoverTrigger>
    );
  }

  return (
    <PopoverTrigger asChild={true} className={className} {...props}>
      <Button variant="outline" size="icon-sm">
        {children || icon}
      </Button>
    </PopoverTrigger>
  );
}
