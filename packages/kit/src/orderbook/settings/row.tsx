import { Label } from '@ui/components/ui/label';
import { cn } from '@ui/lib';
import type { ReactNode } from 'react';
import type { OrderbookSettingsBaseProps } from '@/orderbook/settings/types';

export type OrderbookSettingsRowProps = OrderbookSettingsBaseProps & {
  label: string;
  description?: string;
  control?: ReactNode;
};

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
      className={cn('flex items-center justify-between gap-4', className)}
      {...props}
    >
      <div className="flex flex-col gap-0.5">
        <Label className="text-xs font-semibold">{label}</Label>
        {description && (
          <p className="text-muted-foreground text-xs">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {control}
        {children}
      </div>
    </div>
  );
}
