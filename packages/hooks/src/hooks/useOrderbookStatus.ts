'use client';

import type { ConnectionStatus } from '@krono/core';
import { useEffect, useState } from 'react';
import { useOrderbookInstance } from '../context';

export function useOrderbookStatus() {
  const ob = useOrderbookInstance();
  const [status, setStatus] = useState<ConnectionStatus>(ob.status);

  useEffect(() => ob.onStatusUpdate(setStatus), [ob]);

  return {
    status,
    connected: status === 'connected',
    connecting: status === 'connecting',
    reconnecting: status === 'reconnecting',
    disconnected: status === 'disconnected',
    error: status === 'error',
    idle:
      status === 'disconnected' ||
      status === 'connecting' ||
      status === 'reconnecting',
  };
}
