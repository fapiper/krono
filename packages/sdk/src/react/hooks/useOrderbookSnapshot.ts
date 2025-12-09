'use client';

import { useEffect, useMemo, useState } from 'react';
import type { OrderbookSnapshot } from '../../core';
import { useOrderbookInstance } from '../context';

export function useOrderbookSnapshot() {
  const ob = useOrderbookInstance();

  const initialSnapshot = useMemo(() => ob.currentSnapshot, [ob]);
  const [snapshot, setSnapshot] = useState<OrderbookSnapshot>(initialSnapshot);

  useEffect(() => {
    const unsubscribe = ob.onUpdate(setSnapshot);
    return () => unsubscribe();
  }, [ob]);

  return {
    snapshot,
    asks: snapshot.asks,
    bids: snapshot.bids,
    spread: snapshot.spread,
    spreadPct: snapshot.spreadPct,
    maxAskTotal: snapshot.maxAskTotal,
    maxBidTotal: snapshot.maxBidTotal,
    maxTotal: snapshot.maxTotal,
    timestamp: snapshot.timestamp,
  };
}
