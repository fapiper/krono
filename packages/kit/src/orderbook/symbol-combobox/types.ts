import type { HTMLAttributes } from 'react';

export type OrderbookSymbolComboboxBaseProps = HTMLAttributes<HTMLDivElement>;

export type AssetPairOption = {
  value: string;
  displayLabel: string;
  icon: string;
  baseAsset: string;
};

export type SymbolData = {
  symbols?: AssetPairOption[];
  symbolMap?: Map<string, AssetPairOption>;
  loading: boolean;
  error: Error | null;
};
