import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  type ConnectionStatus,
  Orderbook,
  type OrderbookConfig,
  type OrderbookSnapshot,
} from '../../core';

/**
 * Main hook for orderbook with time-travel capabilities
 */
export function useOrderbook(initialConfig: OrderbookConfig) {
  // Persistent orderbook instance (never recreated)
  const orderbookRef = useRef<Orderbook | null>(null);

  // Live data state
  const [liveSnapshot, setLiveSnapshot] = useState<OrderbookSnapshot | null>(
    null,
  );
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [error, setError] = useState<Error | null>(null);

  // Time-travel state
  const [isLive, setIsLive] = useState(true);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [historicalSnapshot, setHistoricalSnapshot] =
    useState<OrderbookSnapshot | null>(null);
  const [historyLength, setHistoryLength] = useState(0);

  // Initialize orderbook instance once
  // biome-ignore lint/correctness/useExhaustiveDependencies: stable instance with an intentional single init
  useEffect(() => {
    const orderbook = new Orderbook({
      ...initialConfig,
      historyEnabled: true, // Enable history by default for time-travel
    });

    orderbookRef.current = orderbook;

    return () => {
      orderbook.destroy();
      orderbookRef.current = null;
    };
  }, []);

  useEffect(() => {
    const orderbook = orderbookRef.current;
    if (!orderbook) return;

    const handleUpdate = (snap: OrderbookSnapshot) => {
      if (isLive) {
        setLiveSnapshot(snap);
        setHistoryLength(orderbook.getHistory().size);
      }
      setError(null);
    };

    const handleSnapshot = (snap: OrderbookSnapshot) => {
      if (isLive) {
        setLiveSnapshot(snap);
      }
      setError(null);
    };

    const handleStatusChange = (newStatus: ConnectionStatus) => {
      setStatus(newStatus);
    };

    const handleError = (err: Error) => {
      setError(err);
    };

    orderbook.on('update', handleUpdate);
    orderbook.on('snapshot', handleSnapshot);
    orderbook.on('statusChange', handleStatusChange);
    orderbook.on('error', handleError);

    return () => {
      orderbook.off('update', handleUpdate);
      orderbook.off('snapshot', handleSnapshot);
      orderbook.off('statusChange', handleStatusChange);
      orderbook.off('error', handleError);
    };
  }, [isLive]);

  useEffect(() => {
    const orderbook = orderbookRef.current;
    if (!orderbook) return;

    orderbook.connect().catch((err) => {
      console.error('Failed to connect orderbook:', err);
    });

    return () => {
      orderbook.disconnect();
    };
  }, []);

  const connect = useCallback(async () => {
    if (!orderbookRef.current) return;
    await orderbookRef.current.connect();
  }, []);

  const disconnect = useCallback(() => {
    orderbookRef.current?.disconnect();
  }, []);

  const setSymbol = useCallback(async (newSymbol: string) => {
    const orderbook = orderbookRef.current;
    if (!orderbook) return;

    // Setting symbol will automatically:
    // 1. Clear old data (asks, bids, history)
    // 2. Reconnect if connected
    orderbook.symbol = newSymbol;

    // Reset time-travel state
    setIsLive(true);
    setCurrentHistoryIndex(-1);
    setHistoryLength(0);
    setLiveSnapshot(null);
    setHistoricalSnapshot(null);
  }, []);

  const setDepth = useCallback((newDepth: 10 | 25 | 100 | 500 | 1000) => {
    const orderbook = orderbookRef.current;
    if (!orderbook) return;

    // Setting depth will automatically reconnect if connected
    orderbook.depth = newDepth;
  }, []);

  const setThrottleMs = useCallback((ms: number | undefined) => {
    const orderbook = orderbookRef.current;
    if (!orderbook) return;

    // Setting throttle will automatically reconfigure the pipeline
    orderbook.throttleMs = ms;
  }, []);

  const setDebounceMs = useCallback((ms: number | undefined) => {
    const orderbook = orderbookRef.current;
    if (!orderbook) return;

    // Setting debounce will automatically reconfigure the pipeline
    orderbook.debounceMs = ms;
  }, []);

  const setHistoryEnabled = useCallback((enabled: boolean) => {
    const orderbook = orderbookRef.current;
    if (!orderbook) return;

    orderbook.historyEnabled = enabled;
  }, []);

  const setMaxHistoryLength = useCallback((length: number) => {
    const orderbook = orderbookRef.current;
    if (!orderbook) return;

    // Setting max length will automatically resize buffer
    orderbook.maxHistoryLength = length;
    setHistoryLength(orderbook.getHistory().size);
  }, []);

  const setDebug = useCallback((enabled: boolean) => {
    const orderbook = orderbookRef.current;
    if (!orderbook) return;

    orderbook.debug = enabled;
  }, []);

  const goLive = useCallback(() => {
    const orderbook = orderbookRef.current;
    if (!orderbook) return;

    setIsLive(true);
    setCurrentHistoryIndex(-1);

    // Use latest from history or current snapshot
    const history = orderbook.getHistory();
    const latest = history.getLatest() || orderbook.currentSnapshot;
    if (latest) {
      setLiveSnapshot(latest);
    }
  }, []);

  const pause = useCallback(() => {
    const orderbook = orderbookRef.current;
    if (!orderbook) return;

    setIsLive(false);

    const history = orderbook.getHistory();
    if (history.size > 0) {
      const latest = history.getLatest();
      if (latest) {
        setHistoricalSnapshot(latest);
        setCurrentHistoryIndex(history.size - 1);
        setHistoryLength(history.size);
      }
    }
  }, []);

  const goToIndex = useCallback((index: number) => {
    const orderbook = orderbookRef.current;
    if (!orderbook) return;

    const history = orderbook.getHistory();
    if (index < 0 || index >= history.size) return;

    setIsLive(false);
    const snap = history.get(index);
    if (snap) {
      setHistoricalSnapshot(snap);
      setCurrentHistoryIndex(index);
      setHistoryLength(history.size);
    }
  }, []);

  const goBack = useCallback(() => {
    const orderbook = orderbookRef.current;
    if (!orderbook) return;

    const history = orderbook.getHistory();

    if (isLive && history.size >= 2) {
      // From live mode, go to second-to-last
      goToIndex(history.size - 2);
    } else if (!isLive && currentHistoryIndex > 0) {
      // Go back one step
      goToIndex(currentHistoryIndex - 1);
    }
  }, [isLive, currentHistoryIndex, goToIndex]);

  const goForward = useCallback(() => {
    const orderbook = orderbookRef.current;
    if (!orderbook || isLive) return;

    const history = orderbook.getHistory();
    const newIndex = currentHistoryIndex + 1;

    if (newIndex >= history.size - 1) {
      // Reached the end, go back to live
      goLive();
    } else {
      goToIndex(newIndex);
    }
  }, [isLive, currentHistoryIndex, goToIndex, goLive]);

  const clearHistory = useCallback(() => {
    const orderbook = orderbookRef.current;
    if (!orderbook) return;

    orderbook.clearHistory();
    setHistoryLength(0);

    if (!isLive) {
      goLive();
    }
  }, [isLive, goLive]);

  const canGoBack = useMemo(() => {
    const orderbook = orderbookRef.current;
    if (!orderbook) return false;

    const history = orderbook.getHistory();
    return history.size > 0 && (isLive || currentHistoryIndex > 0);
  }, [isLive, currentHistoryIndex]);

  const canGoForward = useMemo(() => {
    const orderbook = orderbookRef.current;
    if (!orderbook || isLive) return false;

    const history = orderbook.getHistory();
    return currentHistoryIndex < history.size - 1;
  }, [isLive, currentHistoryIndex]); //, historyLength]);

  // Current snapshot to display (live or historical)
  const currentSnapshot = isLive ? liveSnapshot : historicalSnapshot;

  return {
    snapshot: currentSnapshot,
    status,
    error,

    // Connection
    connect,
    disconnect,

    // Configuration Setters
    setSymbol,
    setDepth,
    setThrottleMs,
    setDebounceMs,
    setHistoryEnabled,
    setMaxHistoryLength,
    setDebug,

    // Time Travel
    isLive,
    currentHistoryIndex,
    historyLength,
    canGoBack,
    canGoForward,
    goLive,
    pause,
    goBack,
    goForward,
    goToIndex,
    clearHistory,

    orderbook: orderbookRef.current,
  };
}
