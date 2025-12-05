import { useOrderbookInstance } from '../context';

export function useOrderbookConfig() {
  const ob = useOrderbookInstance();

  return {
    symbol: ob.symbol,
    depth: ob.depth,
    throttleMs: ob.throttleMs,
    debounceMs: ob.debounceMs,
    historyEnabled: ob.historyEnabled,
    maxHistoryLength: ob.maxHistoryLength,
    debug: ob.debug,

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
