'use client';

import {
  useOrderbookConfig,
  useOrderbookPlayback,
  useOrderbookStatus,
} from '@krono/hooks';
import { useEffect, useMemo } from 'react';
import { createBreakpoint } from 'react-use';
import { OrderbookControls } from '../controls';
import { OrderbookTableChart } from './chart';
import { OrderbookTableSkeleton } from './skeleton';
import type { OrderbookTableBaseProps } from './types';

const useBreakpoint = createBreakpoint({
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1800,
  '4xl': 2600,
});

const BREAKPOINT_MAP: Record<string, number> = {
  md: 11,
  lg: 22,
  xl: 22,
  '2xl': 36,
  '3xl': 44,
  '4xl': 99,
};

export type OrderbookTableRootProps = OrderbookTableBaseProps;

export function OrderbookTableRoot({
  children,
  ...props
}: OrderbookTableRootProps) {
  const status = useOrderbookStatus();
  const controls = useOrderbookPlayback();
  const { currentData } = controls;

  const { setLimit, limit } = useOrderbookConfig();
  const breakpoint = useBreakpoint();
  const n = BREAKPOINT_MAP[breakpoint] ?? 15;

  useEffect(() => {
    if (limit !== n) {
      setLimit(n);
    }
  }, [n, setLimit, limit]);

  const processedData = useMemo(() => {
    const asks = currentData?.asks.slice(0, n) ?? [];
    const bids = currentData?.bids.slice(0, n) ?? [];

    const maxAsk = (asks.length > 0 ? asks[asks.length - 1]?.total : 0) ?? 0;
    const maxBid = (bids.length > 0 ? bids[bids.length - 1]?.total : 0) ?? 0;

    return { asks, bids, maxAsk, maxBid };
  }, [currentData, n]);

  const loading = status !== 'connected' || !currentData;

  const defaultContent = (
    <>
      {loading ? (
        <>
          <OrderbookTableSkeleton n={n} />
          <OrderbookTableSkeleton n={n} />

          <div className="absolute inset-0 flex items-center justify-center bg-background/25 z-10">
            <span className="text-foreground text-lg p-4">
              Connecting to feed...
            </span>
          </div>
        </>
      ) : (
        <>
          <OrderbookTableChart
            data={processedData.bids}
            maxTotal={processedData.maxBid}
            type="bids"
          />
          <OrderbookTableChart
            data={processedData.asks}
            maxTotal={processedData.maxAsk}
            type="asks"
          />
          <OrderbookControls.Root controls={controls} />
        </>
      )}
    </>
  );

  return (
    <div
      className={
        'relative grid grid-cols-1 md:grid-cols-2 text-xs gap-0.5 flex-1 group overflow-hidden'
      }
      {...props}
    >
      {children || defaultContent}
    </div>
  );
}
