'use client';

import type React from 'react';
import { createContext, useContext } from 'react';
import {
  type UseOrderbookPlaybackReturnType,
  useOrderbookPlayback,
} from '../hooks';

const OrderbookPlaybackContext =
  createContext<UseOrderbookPlaybackReturnType | null>(null);

export function OrderbookPlaybackProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const playback = useOrderbookPlayback();

  return (
    <OrderbookPlaybackContext.Provider value={playback}>
      {children}
    </OrderbookPlaybackContext.Provider>
  );
}

export function useOrderbookPlaybackContext() {
  const context = useContext(OrderbookPlaybackContext);
  if (!context) {
    throw new Error(
      'useOrderbookPlaybackContext must be used within an OrderbookPlaybackProvider',
    );
  }
  return context;
}
