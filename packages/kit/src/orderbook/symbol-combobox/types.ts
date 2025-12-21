export type AssetPairOption = {
  value: string;
  displayLabel: string;
  icon: string;
  baseAsset: string;
  tickSize: number;
  altname: string;
};

export type SymbolData = {
  symbols: AssetPairOption[];
  symbolMap: Map<string, AssetPairOption>;
  loading: boolean;
  error: Error | null;
};
