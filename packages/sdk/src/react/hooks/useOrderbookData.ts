'use client';

import { useEffect, useState } from 'react';
import type { OrderbookData } from '../../core';
import { useOrderbookInstance } from '../context';

export function useOrderbookData(disabled = false): OrderbookData {
  const orderbook = useOrderbookInstance();
  const [data, setData] = useState<OrderbookData>(orderbook.currentData);

  useEffect(() => {
    if (disabled) return;
    const unsubscribe = orderbook.onDataUpdate(setData);
    return unsubscribe;
  }, [disabled, orderbook]);

  return data;
}
