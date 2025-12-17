'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from '@krono/ui/components/ui/command';
import { PopoverContent } from '@krono/ui/components/ui/popover';
import { Loader2 } from 'lucide-react';
import {
  type ComponentProps,
  memo,
  type PropsWithChildren,
  useCallback,
} from 'react';
import { OrderbookSymbolComboboxItem } from './item';
import type { SymbolData } from './types';

export type OrderbookSymbolComboboxContentProps = ComponentProps<
  typeof PopoverContent
> &
  PropsWithChildren<{
    symbol: string;
    data: SymbolData;
    setSymbol: (value: string) => void;
    setOpen: (open: boolean) => void;
  }>;

export const OrderbookSymbolComboboxContent = memo(
  function OrderbookSymbolComboboxContent({
    symbol,
    data,
    setSymbol,
    setOpen,
    className,
    children,
    ...props
  }: OrderbookSymbolComboboxContentProps) {
    const { symbols, loading, error } = data;

    const handleSelect = useCallback(
      (currentValue: string) => {
        setSymbol(currentValue === symbol ? '' : currentValue);
        setOpen(false);
      },
      [symbol, setSymbol, setOpen],
    );

    return (
      <PopoverContent className={className || 'w-60 p-0'} {...props}>
        {/* Allows children to completely override the Command structure */}
        {children || (
          <Command>
            <CommandInput placeholder="Search symbol..." />
            <CommandList>
              {loading ? (
                <CommandEmpty className="flex items-center justify-center py-6">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </CommandEmpty>
              ) : error ? (
                <CommandEmpty className="text-destructive py-6">
                  {error.message}
                </CommandEmpty>
              ) : (
                <>
                  <CommandEmpty>No symbol found.</CommandEmpty>
                  <CommandGroup>
                    {symbols?.map((option) => (
                      <OrderbookSymbolComboboxItem
                        key={option.value}
                        option={option}
                        isSelected={symbol === option.value}
                        onSelect={handleSelect}
                      />
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    );
  },
);
