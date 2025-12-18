import type { AssetPairsData, SymbolOption } from '@krono/core';
import { useCallback, useEffect, useState } from 'react';
import { useAssetPairsInstance } from '../context';

export type UseAssetPairsParameters = { initialData?: AssetPairsData };

export type UseAssetPairsReturnType = {
  symbols: SymbolOption[];
  symbolMap: Map<string, SymbolOption>;
  loading: boolean;
  loaded: boolean;
  error: Error | null;
  topN: number;
  debug: boolean;
  refresh: () => Promise<AssetPairsData>;
  clear: () => void;
  findSymbol: (search: string) => SymbolOption | undefined;
  setTopN: (n: number) => void;
  setDebug: (enabled: boolean) => void;
};

export function useAssetPairs(
  parameters: UseAssetPairsParameters = {},
): UseAssetPairsReturnType {
  const { initialData } = parameters;

  const instance = useAssetPairsInstance();

  const [state, setState] = useState({
    symbols: initialData?.symbols ?? instance.symbols,
    symbolMap: initialData?.symbolMap ?? instance.symbolMap,
    loading: instance.loading,
    loaded: instance.loaded,
    error: instance.error,
    topN: instance.topN,
    debug: instance.debug,
  });

  useEffect(() => {
    const updateState = () => {
      setState({
        symbols: instance.symbols,
        symbolMap: instance.symbolMap,
        loading: instance.loading,
        loaded: instance.loaded,
        error: instance.error,
        topN: instance.topN,
        debug: instance.debug,
      });
    };

    const unsubStatus = instance.onStatusUpdate(updateState);
    const unsubData = instance.onDataUpdate(updateState);
    const unsubError = instance.onError(updateState);
    const unsubConfig = instance.onConfigUpdate(updateState);

    updateState();

    return () => {
      unsubStatus();
      unsubData();
      unsubError();
      unsubConfig();
    };
  }, [instance]);

  /**
   * Force a manual refresh of the pairs list
   */
  const refresh = useCallback(() => instance.refresh(), [instance]);

  /**
   * Clear the internal cache and reset status
   */
  const clear = useCallback(() => instance.clear(), [instance]);

  /**
   * Search for a specific symbol using various identifiers
   */
  const findSymbol = useCallback(
    (search: string) => instance.findSymbol(search),
    [instance],
  );

  /**
   * Update the number of top pairs to track
   */
  const setTopN = useCallback(
    (n: number) => {
      instance.topN = n;
    },
    [instance],
  );

  /**
   * Toggle debug logging
   */
  const setDebug = useCallback(
    (enabled: boolean) => {
      instance.debug = enabled;
    },
    [instance],
  );

  return {
    ...state,
    refresh,
    clear,
    findSymbol,
    setTopN,
    setDebug,
  };
}
