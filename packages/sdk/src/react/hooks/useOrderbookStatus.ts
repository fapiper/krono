'use client';

import { useEffect, useState } from 'react';
import { useOrderbookInstance } from '../context';

export function useOrderbookStatus() {
  const ob = useOrderbookInstance();
  const [status, setStatus] = useState(ob.status);

  useEffect(() => ob.onStatusChange(setStatus), [ob]);

  return status;
}
