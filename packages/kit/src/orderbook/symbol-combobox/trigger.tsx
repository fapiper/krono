'use client';

import { Button } from '@krono/ui/components/ui/button';
import { PopoverTrigger } from '@krono/ui/components/ui/popover';
import { cn } from '@krono/ui/lib';
import { ChevronsUpDown, Loader2 } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';
import { useOrderbookSymbolComboboxContext } from './context';
import { OrderbookSymbolComboboxIcon } from './icon';

export type OrderbookSymbolComboboxTriggerProps = ComponentPropsWithoutRef<
  typeof Button
>;

export function OrderbookSymbolComboboxTrigger({
  className,
  children,
  ...props
}: OrderbookSymbolComboboxTriggerProps) {
  const { open, selectedSymbol, loading, error } =
    useOrderbookSymbolComboboxContext();

  const buttonLabel = (() => {
    if (children) return children;

    if (loading) {
      return (
        <div className="flex items-center gap-x-2">
          <Loader2 className="animate-spin" />
          Loading...
        </div>
      );
    }

    if (selectedSymbol) {
      return (
        <div className="flex items-center gap-x-2">
          <OrderbookSymbolComboboxIcon
            src={selectedSymbol.icon}
            alt={selectedSymbol.baseAsset}
          />
          {selectedSymbol.displayLabel}
        </div>
      );
    }

    return 'Select symbol';
  })();

  return (
    <PopoverTrigger asChild={true}>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className={cn('justify-between gap-x-2', className)}
        size="sm"
        disabled={loading || !!error}
        {...props}
      >
        {buttonLabel}
        {!children && <ChevronsUpDown className="opacity-50 shrink-0" />}
      </Button>
    </PopoverTrigger>
  );
}
