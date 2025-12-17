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
          setSymbol={setSymbol}
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
