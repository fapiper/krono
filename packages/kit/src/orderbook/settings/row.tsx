import { Label } from '@krono/ui/components/ui/label';
import { cn } from '@krono/ui/lib';
import type { ComponentPropsWithoutRef } from 'react';
import type { OrderbookSettingsRowBaseProps } from './types';

export type OrderbookSettingsRowProps = ComponentPropsWithoutRef<'div'> &
  OrderbookSettingsRowBaseProps;

export function OrderbookSettingsRow({
  label,
  description,
  control,
  className,
  children,
  ...props
}: OrderbookSettingsRowProps) {
  return (
    <div
      className={cn('flex items-end justify-between gap-1', className)}
      {...props}
    >
      <div className="flex flex-col gap-y-0">
        <Label className="text-xs font-semibold">{label}</Label>
        {description && (
          <p className="text-muted-foreground text-xs">{description}</p>
        )}
      </div>
      <div className="flex items-end gap-x-2">
        {control}
        {children}
      </div>
    </div>
  );
}
