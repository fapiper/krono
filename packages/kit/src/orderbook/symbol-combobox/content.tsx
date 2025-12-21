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
import type { ComponentPropsWithoutRef } from 'react';
import { useOrderbookSymbolComboboxContext } from './context';
import { OrderbookSymbolComboboxItem } from './item';

export type OrderbookSymbolComboboxContentProps = ComponentPropsWithoutRef<
  typeof PopoverContent
>;

export function OrderbookSymbolComboboxContent({
  className,
  children,
  ...props
}: OrderbookSymbolComboboxContentProps) {
  const { symbols, loading, error, currentSymbol, onSelectSymbol } =
    useOrderbookSymbolComboboxContext();

  return (
    <PopoverContent className={className || 'w-60 p-0'} {...props}>
      {children || (
        <Command>
          <CommandInput placeholder="Search symbol..." />
          <CommandList>
            {loading ? (
              <CommandEmpty className="flex items-center justify-center py-6">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
                      isSelected={currentSymbol === option.value}
                      onSelect={onSelectSymbol}
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
}
