'use client';

import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useRef } from 'react';
import { Orderbook, type OrderbookConfigOptions } from '../../core';

const OrderbookContext = createContext<Orderbook | null>(null);

export type OrderbookProviderProps = PropsWithChildren<{
  config: OrderbookConfigOptions;
}>;

export function OrderbookProvider({
  children,
  config,
}: OrderbookProviderProps) {
  const instanceRef = useRef<Orderbook | null>(null);

  if (!instanceRef.current) {
    instanceRef.current = new Orderbook(config);
  }

  useEffect(() => {
    instanceRef.current?.connect();
    return () => instanceRef.current?.disconnect();
  }, []);

  return (
    <OrderbookContext.Provider value={instanceRef.current}>
      {children}
    </OrderbookContext.Provider>
  );
}

export function useOrderbookInstance() {
  const ctx = useContext(OrderbookContext);
  if (!ctx)
    throw new Error(
      'useOrderbookInstance must be used inside OrderbookProvider',
    );
  return ctx;
}
