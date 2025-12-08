'use client';

import { useEffect, useState } from 'react';
import type { OrderbookSnapshot } from '../../core';
import { useOrderbookInstance } from '../context';

export function useOrderbookSnapshot() {
  const ob = useOrderbookInstance();
  const [snapshot, setSnapshot] = useState<OrderbookSnapshot>({
    timestamp: 0,
    asks: [],
    bids: [],
    spread: 0,
    spreadPct: 0,
    maxAskTotal: 0,
    maxBidTotal: 0,
    maxTotal: 0,
  });

  useEffect(() => {
    const unsubscribe = ob.onUpdate(setSnapshot);
    return () => unsubscribe();
  }, [ob]);

  return snapshot;
}
