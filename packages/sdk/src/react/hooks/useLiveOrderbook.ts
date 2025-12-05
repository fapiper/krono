import { useCallback, useEffect, useRef, useState } from 'react';
import {
  type ConnectionStatus,
  Orderbook,
  type OrderbookConfig,
} from '../../core';
import type { OrderbookSnapshot } from '../types';

/**
 * Simplified hook that only provides live data without time-travel
 */
export function useLiveOrderbook(config: OrderbookConfig) {
  const orderbookRef = useRef<Orderbook | null>(null);
  const [snapshot, setSnapshot] = useState<OrderbookSnapshot | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [error, setError] = useState<Error | null>(null);

  // Initialize once
  // biome-ignore lint/correctness/useExhaustiveDependencies: stable instance with an intentional single init
  useEffect(() => {
    const orderbook = new Orderbook({
      ...config,
      historyEnabled: false, // Disable history for performance
    });
    orderbookRef.current = orderbook;

    return () => {
      orderbook.destroy();
      orderbookRef.current = null;
    };
  }, []);

  // Setup listeners
  useEffect(() => {
    const orderbook = orderbookRef.current;
    if (!orderbook) return;

    const handleUpdate = (snap: OrderbookSnapshot) => {
      setSnapshot(snap);
      setError(null);
    };

    const handleSnapshot = (snap: OrderbookSnapshot) => {
      setSnapshot(snap);
      setError(null);
    };

    const handleStatusChange = (s: ConnectionStatus) => setStatus(s);
    const handleError = (e: Error) => setError(e);

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
  }, []);

  // Auto-connect
  useEffect(() => {
    const orderbook = orderbookRef.current;
    if (!orderbook) return;

    orderbook.connect().catch(console.error);
    return () => orderbook.disconnect();
  }, []);

  // Configuration setters
  const setSymbol = useCallback((newSymbol: string) => {
    if (orderbookRef.current) {
      orderbookRef.current.symbol = newSymbol;
    }
  }, []);

  const setDepth = useCallback((newDepth: 10 | 25 | 100 | 500 | 1000) => {
    if (orderbookRef.current) {
      orderbookRef.current.depth = newDepth;
    }
  }, []);

  const setThrottleMs = useCallback((ms: number | undefined) => {
    if (orderbookRef.current) {
      orderbookRef.current.throttleMs = ms;
    }
  }, []);

  const setDebounceMs = useCallback((ms: number | undefined) => {
    if (orderbookRef.current) {
      orderbookRef.current.debounceMs = ms;
    }
  }, []);

  return {
    snapshot,
    status,
    error,
    orderbook: orderbookRef.current,
    setSymbol,
    setDepth,
    setThrottleMs,
    setDebounceMs,
  };
}
