'use client';

import { useAssetPairs, useOrderbookConfig } from '@krono/hooks';
import { Popover } from '@krono/ui/components/ui/popover';
import {
  type ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { OrderbookSymbolComboboxProvider } from './context';

export type OrderbookSymbolComboboxRootProps = ComponentPropsWithoutRef<
  typeof Popover
>;

export function OrderbookSymbolComboboxRoot({
  children,
  onOpenChange,
  ...props
}: OrderbookSymbolComboboxRootProps) {
  const [open, setOpen] = useState(false);
  const { symbol, setSymbol, setTickSize } = useOrderbookConfig();
  const { symbols, symbolMap, loading, error } = useAssetPairs();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current && !loading && symbols?.length > 0 && !symbol) {
      const first = symbols[0];
      if (first) {
        setTickSize(first.tickSize);
        setSymbol(first.value);
      }
      initializedRef.current = true;
    }
  }, [loading, symbols, symbol, setSymbol, setTickSize]);

  const selectedSymbol = useMemo(() => {
    if (!symbol || !symbols.length) return null;
    const search = symbol.toUpperCase();
    return (
      symbols.find(
        (s) =>
          s.value.toUpperCase() === search ||
          s.displayLabel.toUpperCase() === search ||
          s.altname.toUpperCase() === search.replace('/', ''),
      ) ?? null
    );
  }, [symbol, symbols]);

  const handleSetSymbol = useCallback(
    (value: string) => {
      const found = symbolMap.get(value.toUpperCase());
      if (found) {
        setTickSize(found.tickSize);
        setSymbol(found.value);
      } else {
        setSymbol(value);
      }
      setOpen(false);
    },
    [symbolMap, setSymbol, setTickSize],
  );

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      onOpenChange?.(isOpen);
    },
    [onOpenChange],
  );

  const contextValue = useMemo(
    () => ({
      open,
      setOpen,
      symbols,
      symbolMap,
      loading,
      error,
      selectedSymbol,
      currentSymbol: symbol,
      onSelectSymbol: handleSetSymbol,
    }),
    [
      open,
      symbols,
      symbolMap,
      loading,
      error,
      selectedSymbol,
      symbol,
      handleSetSymbol,
    ],
  );

  return (
    <OrderbookSymbolComboboxProvider value={contextValue}>
      <Popover open={open} onOpenChange={handleOpenChange} {...props}>
        {children}
      </Popover>
    </OrderbookSymbolComboboxProvider>
  );
}
