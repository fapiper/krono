'use client';

import { Separator as BaseSeparator } from '@krono/ui/components/ui/separator';
import { cn } from '@krono/ui/lib';
import type { ComponentPropsWithoutRef } from 'react';

export type OrderbookSettingsSeparatorProps = ComponentPropsWithoutRef<
  typeof BaseSeparator
>;

export function OrderbookSettingsSeparator({
  className,
  ...props
}: OrderbookSettingsSeparatorProps) {
  return (
    <BaseSeparator className={cn('my-2 opacity-50', className)} {...props} />
  );
}
