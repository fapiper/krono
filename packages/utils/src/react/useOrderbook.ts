import {
  type UseQueryOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Orderbook } from '../core';
import type {
  OrderbookControls,
  OrderbookSnapshot,
  OrderbookState,
} from './types';

const orderbookKeys = {
  all: ['kraken-orderbook'] as const,
  symbol: (symbol: string) => [...orderbookKeys.all, symbol] as const,
  detail: (symbol: string, depth: number) =>
    [...orderbookKeys.symbol(symbol), depth] as const,
};

export type UseOrderbookOptions = Partial<
  ConstructorParameters<typeof Orderbook>[0]
> & {
  queryOptions?: UseQueryOptions<OrderbookSnapshot | null>;
};

export const useOrderbook = (
  symbol: string,
  options?: UseOrderbookOptions,
): [OrderbookState, OrderbookControls, ReturnType<typeof useQuery>] => {
  const queryClient = useQueryClient();
  const [isLive, setIsLive] = useState(true);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [snapshot, setSnapshot] = useState<OrderbookSnapshot | null>(null);

  const orderbookRef = useRef<Orderbook | null>(null);

  const queryKey = orderbookKeys.detail(symbol, options?.depth ?? 25);
  const query = useQuery<OrderbookSnapshot | null>({
    queryKey,
    queryFn: () => null,
    enabled: true,
    ...options?.queryOptions,
  });

  useEffect(() => {
    const instance = new Orderbook({ symbol, ...options });
    orderbookRef.current = instance;

    const unsubUpdate = instance.on('update', (s) => {
      setSnapshot(s);
      if (isLive) queryClient.setQueryData(queryKey, s);
    });

    instance.connect();

    return () => {
      instance.destroy();
      unsubUpdate();
    };
  }, [symbol, options, queryClient, queryKey, isLive]);

  const toggleLive = useCallback(() => {
    setIsLive((prev) => {
      const next = !prev;
      if (next && orderbookRef.current) {
        setHistoryIndex(orderbookRef.current.getHistory().size - 1);
      }
      return next;
    });
  }, []);

  const setHistoryIndexSafe = useCallback(
    (idx: number) => {
      const history = orderbookRef.current?.getHistory();
      const maxIndex = (history?.size ?? 1) - 1;
      const safeIdx = Math.max(0, Math.min(idx, maxIndex));
      setHistoryIndex(safeIdx);

      if (safeIdx >= maxIndex && !isLive) toggleLive();
      else if (safeIdx < maxIndex && isLive) toggleLive();
    },
    [isLive, toggleLive],
  );

  const clearHistory = useCallback(() => {
    orderbookRef.current?.clearHistory();
    setHistoryIndex(0);
    setIsLive(true);
  }, []);

  const goToLatest = useCallback(() => {
    const history = orderbookRef.current?.getHistory();
    setHistoryIndex((history?.size ?? 1) - 1);
    setIsLive(true);
  }, []);

  const reconnect = useCallback(() => {
    orderbookRef.current?.connect();
  }, []);

  const historyBuffer = orderbookRef.current?.getHistory();
  const historyArray = historyBuffer?.getAll() ?? [];
  const displayData = isLive
    ? snapshot
    : historyArray[historyIndex] ?? snapshot;

  const state: OrderbookState = {
    data: displayData,
    isLive,
    bufferSize: historyBuffer?.size ?? 0,
    historyIndex,
  };

  const controls: OrderbookControls = {
    toggleLive,
    setHistoryIndex: setHistoryIndexSafe,
    reconnect,
    clearHistory,
    goToLatest,
  };

  return [state, controls, query];
};

export type UseOrderbookReturn = ReturnType<typeof useOrderbook>;
