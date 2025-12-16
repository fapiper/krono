import { useEffect, useState } from 'react';
import type { AssetPairsData, SymbolOption } from '../../core';
import { useAssetPairsInstance } from '../context';

export type AssetPairsState = {
  symbols: SymbolOption[];
  symbolMap: Map<string, SymbolOption>;
  loading: boolean;
  loaded: boolean;
  error: Error | null;
  refresh: () => Promise<AssetPairsData>;
};

export function useAssetPairs(initialData?: AssetPairsData): AssetPairsState {
  const instance = useAssetPairsInstance();

  const [state, setState] = useState<AssetPairsState>({
    symbols: initialData?.symbols ?? instance.symbols,
    symbolMap: initialData?.symbolMap ?? instance.symbolMap,
    loading: instance.loading,
    loaded: instance.loaded,
    error: instance.error ?? null,
    refresh: instance.refresh,
  });

  useEffect(() => {
    const updateState = () => {
      setState({
        symbols: instance.symbols,
        symbolMap: instance.symbolMap,
        loading: instance.loading,
        loaded: instance.loaded,
        error: instance.error ?? null,
        refresh: instance.refresh,
      });
    };

    const unsubscribeStatus = instance.onStatusUpdate(updateState);
    const unsubscribeData = instance.onDataUpdate(updateState);
    const unsubscribeError = instance.onError(updateState);

    updateState();

    return () => {
      unsubscribeStatus();
      unsubscribeData();
      unsubscribeError();
    };
  }, [instance]);

  return state;
}
