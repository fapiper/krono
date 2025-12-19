import { useEffect, useState } from 'react';
import { useOrderbookInstance } from '../context';

export function useOrderbookConfig() {
  const orderbook = useOrderbookInstance();

  const [config, setConfig] = useState(() => ({
    symbol: orderbook.symbol,
    limit: orderbook.limit,
    depth: orderbook.depth,
    tickSize: orderbook.tickSize,
    spreadGrouping: orderbook.spreadGrouping,
    throttleMs: orderbook.throttleMs,
    debounceMs: orderbook.debounceMs,
    historyEnabled: orderbook.historyEnabled,
    maxHistoryLength: orderbook.maxHistoryLength,
    debug: orderbook.debug,
    groupingOptions: orderbook.groupingOptions,
  }));

  useEffect(() => {
    orderbook.spreadGrouping = orderbook.tickSize;
  }, [orderbook.tickSize, orderbook]);

  useEffect(() => {
    const unsubscribe = orderbook.onConfigUpdate((newConfig) => {
      setConfig({
        symbol: newConfig.symbol,
        tickSize: newConfig.tickSize,
        limit: newConfig.limit,
        depth: newConfig.depth,
        spreadGrouping: newConfig.spreadGrouping,
        throttleMs: newConfig.throttleMs,
        debounceMs: newConfig.debounceMs,
        historyEnabled: newConfig.historyEnabled,
        maxHistoryLength: newConfig.maxHistoryLength,
        debug: newConfig.debug,
        // Always read the computed options directly from the instance
        // as they are derived from the tickSize
        groupingOptions: orderbook.groupingOptions,
      });
    });
    return () => unsubscribe();
  }, [orderbook]);

  return {
    ...config,
    setSymbol: (v: string) => {
      orderbook.symbol = v;
    },
    setTickSize: (v: number) => {
      orderbook.tickSize = v;
    },
    groupingOptions: orderbook.groupingOptions,
    setSpreadGrouping: (v: number) => {
      orderbook.spreadGrouping = v;
    },
    setLimit: (v: number) => {
      orderbook.limit = v;
    },
    setDepth: (v: 10 | 25 | 100 | 500 | 1000) => {
      orderbook.depth = v;
    },
    setThrottle: (v: number | undefined) => {
      orderbook.throttleMs = v;
    },
    setDebounce: (v: number | undefined) => {
      orderbook.debounceMs = v;
    },
    setHistoryEnabled: (v: boolean) => {
      orderbook.historyEnabled = v;
    },
    setMaxHistoryLength: (v: number) => {
      orderbook.maxHistoryLength = v;
    },
    setDebug: (v: boolean) => {
      orderbook.debug = v;
    },
  };
}
