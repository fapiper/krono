'use client';

import { useAssetPairs, useOrderbookConfig } from '@krono/hooks';
import { Popover } from '@krono/ui/components/ui/popover';
import {
  type ComponentProps,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { OrderbookSymbolComboboxContent } from './content';
import { OrderbookSymbolComboboxTrigger } from './trigger';
import type { OrderbookSymbolComboboxBaseProps, SymbolData } from './types';

export type OrderbookSymbolComboboxRootProps =
  OrderbookSymbolComboboxBaseProps & ComponentProps<typeof Popover>;

export const OrderbookSymbolComboboxRoot = memo(
  function OrderbookSymbolComboboxRoot({
    className,
    children,
    ...props
  }: OrderbookSymbolComboboxRootProps) {
    const [open, setOpen] = useState(false);

    const { symbol, setSymbol, setTickSize } = useOrderbookConfig();
    const { symbols, symbolMap, loading, error } = useAssetPairs();

    const initializedRef = useRef(false);

    useEffect(() => {
      if (
        !initializedRef.current &&
        !loading &&
        symbols?.length > 0 &&
        !symbol
      ) {
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
      },
      [symbolMap, setSymbol, setTickSize],
    );

    const data: SymbolData = { symbols, symbolMap, loading, error };

    const handleOpenChange = useCallback((isOpen: boolean) => {
      setOpen(isOpen);
    }, []);

    const defaultContent = (
      <>
        <OrderbookSymbolComboboxTrigger
          open={open}
          selectedSymbol={selectedSymbol}
          loading={loading}
          error={error}
        />
        <OrderbookSymbolComboboxContent
          symbol={symbol}
          data={data}
          setSymbol={handleSetSymbol} // Pass the enhanced handler
          setOpen={setOpen}
        />
      </>
    );

    return (
      <Popover open={open} onOpenChange={handleOpenChange} {...props}>
        {children ?? defaultContent}
      </Popover>
    );
  },
);
