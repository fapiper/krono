'use client';

import { useAssetPairs, useOrderbookConfig } from '@krono/sdk/react';
import { Button } from '@ui/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@ui/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@ui/components/ui/popover';
import { cn } from '@ui/lib';
import { CheckIcon, ChevronsUpDownIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

export const OrderbookSymbolComboboxRoot = memo(
  function OrderbookSymbolComboboxRoot() {
    const [open, setOpen] = useState(false);
    const { symbol, setSymbol } = useOrderbookConfig();
    const { symbols, symbolMap, loading, error } = useAssetPairs();

    const initializedRef = useRef(false);

    useEffect(() => {
      if (
        !initializedRef.current &&
        !loading &&
        symbols?.length > 0 &&
        !symbol
      ) {
        setSymbol(symbols[0]?.value ?? '');
        initializedRef.current = true;
      }
    }, [loading, symbols, symbol, setSymbol]);

    const selectedSymbol = useMemo(() => {
      if (!symbol) return null;
      return symbolMap?.get(symbol.toUpperCase()) ?? null;
    }, [symbol, symbolMap]);

    const buttonLabel = useMemo(() => {
      if (loading) {
        return (
          <div className="flex items-center gap--x2">
            <Loader2 className="animate-spin" />
            Loading...
          </div>
        );
      }
      if (error) return 'Error';

      if (selectedSymbol) {
        return (
          <div className="flex items-center gap-x-2">
            <SymbolIcon
              src={selectedSymbol.icon}
              alt={selectedSymbol.baseAsset}
            />
            <span className="font-medium">{selectedSymbol.displayLabel}</span>
          </div>
        );
      }

      return 'Select symbol';
    }, [loading, error, selectedSymbol]);

    const handleSelect = useCallback(
      (currentValue: string) => {
        setSymbol(currentValue === symbol ? '' : currentValue);
        setOpen(false);
      },
      [symbol, setSymbol],
    );

    const handleOpenChange = useCallback((isOpen: boolean) => {
      setOpen(isOpen);
    }, []);

    return (
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild={true}>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-48 justify-between gap-x-2"
            size="sm"
            disabled={loading || !!error}
          >
            {buttonLabel}
            <ChevronsUpDownIcon className="opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-60 p-0">
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
                      <SymbolItem
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
        </PopoverContent>
      </Popover>
    );
  },
);

const SymbolItem = memo<{
  option: {
    value: string;
    displayLabel: string;
    icon: string;
    baseAsset: string;
  };
  isSelected: boolean;
  onSelect: (value: string) => void;
}>(function SymbolItem({ option, isSelected, onSelect }) {
  const handleSelect = useCallback(() => {
    onSelect(option.value);
  }, [option.value, onSelect]);

  return (
    <CommandItem
      value={option.value}
      onSelect={handleSelect}
      className={'gap-x-2'}
    >
      <CheckIcon
        className={cn('shrink-0', isSelected ? 'opacity-100' : 'opacity-0')}
      />
      <SymbolIcon src={option.icon} alt={option.baseAsset} />
      <span>{option.displayLabel}</span>
    </CommandItem>
  );
});

const SymbolIcon = memo<{ src: string; alt: string }>(function SymbolIcon({
  src,
  alt,
}) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-muted text-xs font-semibold">
        {alt[0]}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={20}
      height={20}
      className="rounded-sm shrink-0"
      onError={() => setError(true)}
      unoptimized={true}
    />
  );
});
