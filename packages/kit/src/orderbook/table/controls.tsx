'use client';

import type { useOrderbookPlayback } from '@krono/sdk/react';
import { Badge } from '@ui/components/ui/badge';
import { Button } from '@ui/components/ui/button';
import { Slider } from '@ui/components/ui/slider';
import { cn } from '@ui/lib';
import { format, intervalToDuration } from 'date-fns';
import { Pause, Play, StepBack, StepForward } from 'lucide-react';
import type { HTMLAttributes } from 'react';

const formatDistanceInterval = (laterDate: number, earlierDate: number) => {
  const diffMs = Math.max(0, earlierDate - laterDate);
  const duration = intervalToDuration({ start: 0, end: diffMs });

  const zeroPad = (num?: number) => String(num ?? 0).padStart(2, '0');

  if ((duration.hours ?? 0) > 0) {
    return `${zeroPad(duration.hours)}:${zeroPad(duration.minutes)}:${zeroPad(
      duration.seconds,
    )}`;
  }

  return `${zeroPad(duration.minutes)}:${zeroPad(duration.seconds)}`;
};

export type OrderbookTableControlsProps = HTMLAttributes<HTMLDivElement> & {
  controls: ReturnType<typeof useOrderbookPlayback>;
};

export function OrderbookTableControls({
  className,
  children,
  controls,
  ...props
}: OrderbookTableControlsProps) {
  const {
    isLive,
    isPaused,
    isPlaying,
    togglePaused,
    goToIndex,
    goBack,
    goForward,
    goToLive,
    goToStart,
    canGoBack,
    canGoForward,
    index: currentIndex,
    historyLength,
    currentData,
    nextFrameInfo,
    timeBehindLive,
  } = controls;

  const now = Date.now();
  const currentTimestamp = currentData?.timestamp ?? now;

  const showBuffer = !isLive && nextFrameInfo;
  const bufferStart = (currentIndex / Math.max(1, historyLength - 1)) * 100;
  const bufferWidth = showBuffer ? nextFrameInfo.progress * 100 : 0;

  const sliderMax = Math.max(0, historyLength - 1);
  const sliderValue = isLive ? sliderMax : currentIndex;

  return (
    <>
      <Badge
        variant="outline"
        size="xs"
        className={cn(
          'absolute right-4 lg:right-6 top-3 bg-background',
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
        {isLive ? 'Live' : 'Travelling'}
      </Badge>

      <div
        className={cn(
          'absolute flex flex-col bottom-0 left-0 w-full py-3 px-4 lg:px-6',
          'bg-black/5 dark:bg-black/25',
          'transition-opacity duration-200',
          isPaused
            ? 'opacity-100 visible'
            : 'opacity-0 invisible group-hover:visible group-hover:opacity-100',
          className,
        )}
        {...props}
      >
        {children}

        <div className="absolute top-0 left-0 transform -translate-y-1/2 flex w-full">
          {showBuffer && (
            <div
              className="absolute pointer-events-none h-1 bg-black/50 dark:bg-white/50 left-0"
              style={{
                width: `${bufferWidth}%`,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1,
              }}
            />
          )}

          <Slider
            className="flex-1 cursor-pointer relative z-10"
            step={1}
            min={0}
            max={sliderMax}
            value={[sliderValue]}
            onValueChange={(values) => goToIndex(values[0] ?? 0)}
          />
        </div>

        <div className="flex flex-row items-center gap-2 justify-between">
          <div className="flex flex-row items-center gap-2">
            <Button
              className="rounded-full"
              size="icon-sm"
              variant="default"
              onClick={goBack}
              disabled={!canGoBack}
            >
              <StepBack />
            </Button>

            <Button
              className="rounded-full"
              size="icon-sm"
              variant="default"
              onClick={togglePaused}
            >
              {isPlaying ? <Pause /> : <Play />}
            </Button>

            <Button
              className="rounded-full"
              size="icon-sm"
              variant="default"
              onClick={goForward}
              disabled={!canGoForward}
            >
              <StepForward />
            </Button>
          </div>

          <Badge
            size="sm"
            className="font-normal hover:bg-primary bg-primary tabular-nums"
            variant="default"
          >
            {format(currentTimestamp, 'HH:mm:ss')}
            {!isLive && timeBehindLive >= 1000 && (
              <>
                {' / '}-{formatDistanceInterval(currentTimestamp, now)}
              </>
            )}
          </Badge>
        </div>
      </div>
    </>
  );
}
