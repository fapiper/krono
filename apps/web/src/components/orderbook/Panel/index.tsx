'use client';

import { OrderbookPanelChart } from '@/components/orderbook/Panel/Chart';
import { OrderbookPanelSelect } from '@/components/orderbook/Panel/Symbol';
import {
  useOrderbookConfig,
  useOrderbookPlayback,
  useOrderbookStatus,
} from '@krono/sdk/react';
import { Button } from '@krono/ui/components/ui/button';
import { Card, CardContent, CardHeader } from '@ui/components/ui/card';
import { Slider } from '@ui/components/ui/slider';
import { format } from 'date-fns';

import { Badge } from '@ui/components/ui/badge';
import { cn } from '@ui/lib';
import {
  ArrowRightCircle,
  Pause,
  Play,
  StepBack,
  StepForward,
} from 'lucide-react';
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
  const { debug, setDebug, maxHistoryLength } = useOrderbookConfig();
  const {
    isLive,
    canGoBack,
    goBack,
    canGoForward,
    goForward,
    isPaused,
    togglePaused,
    goToLive,
    index: currentIndex,
    currentSnapshot,
    goToIndex,
  } = useOrderbookPlayback();

  const breakpoint = useBreakpoint();
  const n =
    { md: 11, lg: 22, xl: 22, '2xl': 36, '3xl': 44, '4xl': 99 }[breakpoint] ??
    15;

  return (
    <>
      <Card className={'relative flex flex-1 flex-col overflow-hidden group'}>
        {status === 'connecting' ? (
          <>Connecting</>
        ) : (
          <>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 pb-px pt-2 text-xs gap-[2px] flex-1 overflow-hidden">
              <OrderbookPanelChart
                key={`bids-${currentIndex}`}
                data={currentSnapshot.bids.slice(
                  0,
                  n - currentSnapshot.bids.length,
                )}
                maxTotal={currentSnapshot.maxBidTotal}
                type="bids"
              />

              <OrderbookPanelChart
                key={`asks-${currentIndex}`}
                data={currentSnapshot.asks.slice(
                  0,
                  n - currentSnapshot.asks.length,
                )}
                maxTotal={currentSnapshot.maxAskTotal}
                type="asks"
              />

              <div
                className={
                  'absolute flex flex-col gap-y-2 bottom-0 left-0 w-full pb-2 px-4 lg:px-6 backdrop-blur-sm bg-white/25 dark:bg-black/25 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-opacity ease-in duration-200'
                }
              >
                <div className={'w-full'}>
                  <Slider
                    step={1}
                    min={0}
                    max={maxHistoryLength}
                    value={[currentIndex]}
                    onValueChange={(values) => goToIndex(values[0] ?? 0)}
                  />
                </div>

                <div className={'flex flex-row items-center gap-2'}>
                  <Button
                    size={'icon-sm'}
                    variant={'default'}
                    className={'rounded-full'}
                    onClick={() => goBack()}
                    disabled={!canGoBack}
                  >
                    <StepBack />
                  </Button>

                  <Button
                    size={'icon-sm'}
                    variant={'default'}
                    className={'rounded-full'}
                    onClick={() => togglePaused()}
                  >
                    {isPaused ? <Play /> : <Pause />}
                  </Button>

                  <Button
                    size={'icon-sm'}
                    variant={'default'}
                    className={'rounded-full'}
                    onClick={() => goForward()}
                    disabled={!canGoForward}
                  >
                    <StepForward />
                  </Button>
                  <Badge
                    size={'sm'}
                    className={
                      'font-normal hover:bg-background rounded-full bg-background tabular-nums'
                    }
                    variant={'secondary'}
                  >
                    {format(currentSnapshot.timestamp, 'PPpp')}
                  </Badge>
                </div>
              </div>
            </CardContent>

            <Badge
              variant="outline"
              size={'xs'}
              className={cn(
                'absolute right-4 lg:right-6 bottom-3 bg-background',
                !isLive &&
                  'opacity-50 hover:opacity-100 cursor-pointer transition-opacity',
              )}
              onClick={() => !isLive && goToLive()}
            >
              <span className="relative flex size-1.5">
                {isLive ? (
                  <>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-red-600" />
                  </>
                ) : (
                  <>
                    <span className="absolute inline-flex h-full w-full rounded-full bg-gray-500 opacity-75" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-gray-600" />
                  </>
                )}
              </span>
              Live
            </Badge>
          </>
        )}
      </Card>
    </>
  );
}
