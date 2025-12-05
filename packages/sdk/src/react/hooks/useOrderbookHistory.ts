import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOrderbookInstance } from '../context';
import type { OrderbookSnapshot } from '../types';

export function useOrderbookHistory(maxAutoClamp = true) {
  const ob = useOrderbookInstance();

  const initial = useMemo(() => ob.getHistory().getAll(), [ob]);

  const [history, setHistory] = useState<OrderbookSnapshot[]>(initial);

  const [index, setIndex] = useState<number>(initial.length - 1);

  useEffect(() => {
    const handler = (newHistory: OrderbookSnapshot[]) => {
      setHistory(newHistory);

      if (maxAutoClamp) {
        setIndex((i) => Math.min(i, newHistory.length - 1));
      }
    };

    const unsubscribe = ob.onHistoryUpdate(handler);
    return () => unsubscribe();
  }, [ob, maxAutoClamp]);

  const current = useMemo(() => history[index] ?? null, [history, index]);

  const next = useCallback(
    () => setIndex((i) => Math.min(i + 1, history.length - 1)),
    [history.length],
  );

  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  const reset = useCallback(
    () => setIndex(history.length - 1),
    [history.length],
  );

  const select = useCallback(
    (i: number) => setIndex(Math.max(0, Math.min(i, history.length - 1))),
    [history.length],
  );

  return {
    history,
    index,
    current,
    next,
    prev,
    reset,
    select,
  };
}
