'use client';

import {
  useOrderbookConfig,
  useOrderbookPlaybackContext,
  useOrderbookStatus,
} from '@krono/hooks';
import { cn } from '@krono/ui/lib';
import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useEffect,
  useMemo,
} from 'react';
import { createBreakpoint, useMountedState } from 'react-use';
import { OrderbookPanelSkeleton } from './panel-skeleton';
import type { OrderbookTableRootProps } from './table';

const useBreakpoint = createBreakpoint({
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1800,
  '4xl': 2600,
});

const DEFAULT_BREAKPOINT_MAP: Record<string, number> = {
  md: 11,
  lg: 22,
  xl: 22,
  '2xl': 36,
  '3xl': 44,
  '4xl': 99,
};

export type OrderbookPanelProps = ComponentPropsWithoutRef<'div'> & {
  breakpointMap?: Record<string, number>;
  defaultRowCount?: number;
  enableResponsive?: boolean;
  renderLoading?: () => ReactNode;
  renderTable?: (props: Omit<OrderbookTableRootProps, 'columns'>) => ReactNode;
};

export function OrderbookPanel({
  breakpointMap = DEFAULT_BREAKPOINT_MAP,
  defaultRowCount = 20,
  enableResponsive = true,
  renderLoading,
  renderTable,
  className,
  children,
  ...props
}: OrderbookPanelProps) {
  const { reconnecting, idle } = useOrderbookStatus();
  const controls = useOrderbookPlaybackContext();
  const { currentData, historyLength } = controls;
  const { setLimit, limit } = useOrderbookConfig();
  const isMounted = useMountedState();

  const breakpoint = useBreakpoint();
  const rowCount =
    enableResponsive && isMounted()
      ? (breakpointMap[breakpoint] ?? defaultRowCount)
      : defaultRowCount;

  useEffect(() => {
    if (enableResponsive && limit !== rowCount) {
      setLimit(rowCount);
    }
  }, [rowCount, setLimit, limit, enableResponsive]);

  const processedData = useMemo(() => {
    const asks = currentData?.asks.slice(0, rowCount) ?? [];
    const bids = currentData?.bids.slice(0, rowCount) ?? [];
    const maxAsk = (asks.length > 0 ? asks[asks.length - 1]?.total : 0) ?? 0;
    const maxBid = (bids.length > 0 ? bids[bids.length - 1]?.total : 0) ?? 0;

    return {
      asks: {
        data: asks,
        maxTotal: maxAsk,
        type: 'asks' as const,
      },
      bids: {
        data: bids,
        maxTotal: maxBid,
        type: 'bids' as const,
      },
    };
  }, [currentData, rowCount]);

  const loading = idle || historyLength <= 0;

  return (
    <div
      className={cn(
        'relative grid grid-cols-1 md:grid-cols-2 text-xs gap-px shrink grow overflow-hidden',
        !loading && 'group/krono-orderbook-panel',
        className,
      )}
      data-loading={loading ? 'true' : 'false'}
      {...props}
    >
      {loading ? (
        (renderLoading?.() ?? (
          <OrderbookPanelSkeleton rows={rowCount}>
            <span className="text-foreground text-lg p-4">
              {reconnecting
                ? 'Reconnecting to feed...'
                : 'Connecting to feed...'}
            </span>
          </OrderbookPanelSkeleton>
        ))
      ) : renderTable ? (
        <>
          {renderTable({ ...processedData.bids, direction: 'rtl' })}
          {renderTable({ ...processedData.asks })}
        </>
      ) : null}
      {children}
    </div>
  );
}
