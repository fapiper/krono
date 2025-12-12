'use client';

import { OrderbookPanelChart } from '@/components/orderbook/Panel/Chart';
import {
  useOrderbookConfig,
  useOrderbookPlayback,
  useOrderbookStatus,
} from '@krono/sdk/react';
import { Card, CardContent } from '@ui/components/ui/card';

import { OrderbookPanelControls } from '@/components/orderbook/Panel/Controls';
import { OrderbookPanelSkeleton } from '@/components/orderbook/Panel/Skeleton';
import { useMemo } from 'react';
import { createBreakpoint } from 'react-use';

const useBreakpoint = createBreakpoint({
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1800,
  '4xl': 2600,
});

export function OrderbookPanel() {
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

  return (
    <Card className={'relative flex flex-1 flex-col overflow-hidden group'}>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 pb-px pt-2 text-xs gap-[2px] flex-1 overflow-hidden">
        {loading ? (
          <>
            <OrderbookPanelSkeleton n={n} />
            <OrderbookPanelSkeleton n={n} />

            <div className="absolute inset-0 flex items-center justify-center bg-background/25 z-10">
              <span className="text-foreground text-xl p.4">
                Connecting to feed...
              </span>
            </div>
          </>
        ) : (
          <>
            <OrderbookPanelChart
              data={processedData.bids}
              maxTotal={processedData.maxBid}
              type="bids"
            />
            <OrderbookPanelChart
              data={processedData.asks}
              maxTotal={processedData.maxAsk}
              type="asks"
            />
            <OrderbookPanelControls controls={controls} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
