import { useEffect, useMemo, useState } from 'react';
import type { OrderbookData } from '../../core';
import { useOrderbookInstance } from '../context';

export function useOrderbookHistory() {
  const orderbook = useOrderbookInstance();

  const [historyData, setHistoryData] = useState<OrderbookData[]>(() =>
    orderbook.getHistory().getAll(),
  );

  useEffect(() => {
    return orderbook.onHistoryUpdate((history) => {
      setHistoryData(history.getAll());
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
