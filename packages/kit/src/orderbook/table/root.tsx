'use client';

import { useOrderbookPlayback, useOrderbookStatus } from '@krono/hooks';
import { useMemo } from 'react';
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

export type OrderbookTableRootProps = OrderbookTableBaseProps;

export function OrderbookTableRoot({
  children,
  ...props
}: OrderbookTableRootProps) {
  const status = useOrderbookStatus();
  const controls = useOrderbookPlayback();
  const { currentData } = controls;

  const breakpoint = useBreakpoint();
  const n =
    { md: 11, lg: 22, xl: 22, '2xl': 36, '3xl': 44, '4xl': 99 }[breakpoint] ??
    15;

  const processedData = useMemo(() => {
    return {
      asks: currentData?.asks.slice(0, n) ?? [],
      bids: currentData?.bids.slice(0, n) ?? [],
      maxAsk: currentData?.maxAskTotal ?? 0,
      maxBid: currentData?.maxBidTotal ?? 0,
    };
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

  return <>{children || defaultContent}</>;
}
