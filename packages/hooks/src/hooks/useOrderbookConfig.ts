import { useEffect, useState } from 'react';
import { useOrderbookInstance } from '../context';

export function useOrderbookConfig() {
  const ob = useOrderbookInstance();

  const [config, setConfig] = useState(() => ({
    symbol: ob.symbol,
    depth: ob.depth,
    throttleMs: ob.throttleMs,
    debounceMs: ob.debounceMs,
    historyEnabled: ob.historyEnabled,
    maxHistoryLength: ob.maxHistoryLength,
    debug: ob.debug,
  }));

  useEffect(() => {
    const unsubscribe = ob.onConfigUpdate((newConfig) => {
      setConfig({
        symbol: newConfig.symbol,
        depth: newConfig.depth,
        throttleMs: newConfig.throttleMs,
        debounceMs: newConfig.debounceMs,
        historyEnabled: newConfig.historyEnabled,
        maxHistoryLength: newConfig.maxHistoryLength,
        debug: newConfig.debug,
      });
    });
    return () => unsubscribe();
  }, [ob]);

  return {
    ...config,
    setSymbol: (v: string) => {
      ob.symbol = v;
    },
    setDepth: (v: 10 | 25 | 100 | 500 | 1000) => {
      ob.depth = v;
    },
    setThrottle: (v: number | undefined) => {
      ob.throttleMs = v;
    },
    setDebounce: (v: number | undefined) => {
      ob.debounceMs = v;
    },
    setHistoryEnabled: (v: boolean) => {
      ob.historyEnabled = v;
    },
    setMaxHistoryLength: (v: number) => {
      ob.maxHistoryLength = v;
    },
    setDebug: (v: boolean) => {
      ob.debug = v;
    },
  };
}
