import { useCallback, useEffect, useState } from 'react';
import { useOrderbookInstance } from '../context';
import { useOrderbookStatus } from './useOrderbookStatus';

export function useOrderbookConnection() {
  const ob = useOrderbookInstance();
  const status = useOrderbookStatus();

  const connect = useCallback(() => ob.connect(), [ob]);
  const disconnect = useCallback(() => ob.disconnect(), [ob]);

  return { status, connect, disconnect };
}
