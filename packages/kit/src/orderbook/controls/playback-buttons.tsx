'use client';

import { useOrderbookPlaybackContext } from '@krono/hooks';
import { Badge } from '@krono/ui/components/ui/badge';
import { Button } from '@krono/ui/components/ui/button';
import { cn } from '@krono/ui/lib';
import { format } from 'date-fns';
import { Pause, Play, StepBack, StepForward } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';
import { useMountedState } from 'react-use';
import { formatDistanceInterval } from './utils';

export type OrderbookControlsPlaybackButtonsProps =
  ComponentPropsWithoutRef<'div'> & {
    showTimestamp?: boolean;
    timestampFormat?: string;
  };

export function OrderbookControlsPlaybackButtons({
  showTimestamp = true,
  timestampFormat = 'HH:mm:ss',
  className,
  children,
  ...props
}: OrderbookControlsPlaybackButtonsProps) {
  const {
    isLive,
    isPlaying,
    togglePaused,
    goBack,
    goForward,
    canGoBack,
    canGoForward,
    currentData,
    timeBehindLive,
  } = useOrderbookPlaybackContext();

  const now = Date.now();
  const currentTimestamp = currentData?.timestamp ?? now;
  const isMounted = useMountedState();

  if (children) {
    return (
      <div
        className={cn(
          'flex flex-row items-center gap-2 justify-between w-full',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-row items-center gap-2 justify-between w-full',
        className,
      )}
      {...props}
    >
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

      {isMounted() && showTimestamp && (
        <Badge
          size="sm"
          className="font-normal hover:bg-primary bg-primary tabular-nums"
          variant="default"
        >
          {format(currentTimestamp, timestampFormat)}
          {!isLive && timeBehindLive >= 1000 && (
            <> / -{formatDistanceInterval(currentTimestamp, now)}</>
          )}
        </Badge>
      )}
    </div>
  );
}
