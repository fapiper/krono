'use client';

import { createContext, useContext } from 'react';
import type { AssetPairOption, SymbolData } from './types';

export type OrderbookSymbolComboboxContextValue = SymbolData & {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedSymbol: AssetPairOption | null;
  currentSymbol: string;
  onSelectSymbol: (value: string) => void;
};

const OrderbookSymbolComboboxContext =
  createContext<OrderbookSymbolComboboxContextValue | null>(null);

export function useOrderbookSymbolComboboxContext() {
  const context = useContext(OrderbookSymbolComboboxContext);
  if (!context) {
    throw new Error(
      'useOrderbookSymbolComboboxContext must be used within an OrderbookSymbolComboboxRoot',
    );
  }
  return context;
}

export const OrderbookSymbolComboboxProvider =
  OrderbookSymbolComboboxContext.Provider;
