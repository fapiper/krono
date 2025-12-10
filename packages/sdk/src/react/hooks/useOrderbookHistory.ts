import { useEffect, useMemo, useState } from 'react';
import type { OrderbookData } from '../../core';
import { useOrderbookInstance } from '../context';

export function useOrderbookHistory() {
  const ob = useOrderbookInstance();

  const initialHistory = useMemo(() => ob.getHistory().getAll(), [ob]);
  const [history, setHistory] = useState<OrderbookData[]>(initialHistory);

  useEffect(() => {
    const unsubscribe = ob.onHistoryUpdate(setHistory);
    return () => unsubscribe();
  }, [ob]);

  return {
    history,
    length: history.length,
    getData: (index: number) => history[index] ?? null,
  };
}
