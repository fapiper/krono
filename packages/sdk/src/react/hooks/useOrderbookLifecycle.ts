'use client';

import { useCallback } from 'react';
import { useOrderbookInstance } from '../context';

export function useOrderbookLifecycle() {
  const ob = useOrderbookInstance();
  return {
    destroy: useCallback(() => ob.destroy(), [ob]),
    clearHistory: useCallback(() => ob.clearHistory(), [ob]),
  };
}
