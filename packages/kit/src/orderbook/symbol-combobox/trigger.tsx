'use client';

import { Button } from '@krono/ui/components/ui/button';
import { PopoverTrigger } from '@krono/ui/components/ui/popover';
import { cn } from '@krono/ui/lib';
import { ChevronsUpDown, Loader2 } from 'lucide-react';
import {
  type ComponentProps,
  memo,
  type PropsWithChildren,
  useMemo,
} from 'react';
import { OrderbookSymbolComboboxIcon } from './icon';
import type { AssetPairOption } from './types';

export type OrderbookSymbolComboboxTriggerProps = ComponentProps<
  typeof PopoverTrigger
> &
  PropsWithChildren<{
    open: boolean;
    selectedSymbol?: AssetPairOption | null;
    loading: boolean;
    error: Error | null;
  }>;

export const OrderbookSymbolComboboxTrigger = memo(
  function OrderbookSymbolComboboxTrigger({
    open,
    selectedSymbol,
    loading,
    error,
    className,
    children,
    ...props
  }: OrderbookSymbolComboboxTriggerProps) {
    const buttonLabel = useMemo(() => {
      if (children) return children;

      if (loading) {
        return (
          <div className="flex items-center gap-x-2">
            <Loader2 className="animate-spin h-4 w-4" />
            Loading...
          </div>
        );
      }
      if (error) return 'Error';

      if (selectedSymbol) {
        return (
          <div className="flex items-center gap-x-2">
            <OrderbookSymbolComboboxIcon
              src={selectedSymbol.icon}
              alt={selectedSymbol.baseAsset}
            />
            <span className="font-medium">{selectedSymbol.displayLabel}</span>
          </div>
        );
      }

      return 'Select symbol';
    }, [loading, error, selectedSymbol, children]);

    return (
      <PopoverTrigger asChild {...props}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-48 justify-between gap-x-2', className)}
          size="sm"
          disabled={loading || !!error}
        >
          {buttonLabel}
          {!children && (
            <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
          )}
        </Button>
      </PopoverTrigger>
    );
  },
);
