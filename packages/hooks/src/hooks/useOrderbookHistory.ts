import type { OrderbookData } from '@krono/core';
import { useEffect, useMemo, useState } from 'react';
import { useOrderbookInstance } from '../context';

export function useOrderbookHistory() {
  const orderbook = useOrderbookInstance();

  const [historyData, setHistoryData] = useState<OrderbookData[]>(
    () => orderbook.history,
  );

  useEffect(() => {
    return orderbook.onHistoryUpdate((newHistoryData) => {
      setHistoryData(newHistoryData);
    });
  }, [orderbook]);

  return useMemo(
    () => ({
      get: (index: number) => historyData[index],
      getAll: () => historyData,
      getLatest: () => historyData[historyData.length - 1],
      size: historyData.length,
      isEmpty: historyData.length === 0,
    }),
    [historyData],
  );
}
