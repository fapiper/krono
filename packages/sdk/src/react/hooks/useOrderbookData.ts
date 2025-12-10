'use client';

import { useEffect, useMemo, useState } from 'react';
import type { OrderbookData } from '../../core';
import { useOrderbookInstance } from '../context';

export function useOrderbookData() {
  const ob = useOrderbookInstance();

  const initialData = useMemo(() => ob.currentData, [ob]);
  const [data, setData] = useState<OrderbookData>(initialData);

  useEffect(() => {
    const unsubscribe = ob.onDataUpdate(setData);
    return () => unsubscribe();
  }, [ob]);

  return {
    data,
    asks: data.asks,
    bids: data.bids,
    spread: data.spread,
    spreadPct: data.spreadPct,
    maxAskTotal: data.maxAskTotal,
    maxBidTotal: data.maxBidTotal,
    maxTotal: data.maxTotal,
    timestamp: data.timestamp,
  };
}
