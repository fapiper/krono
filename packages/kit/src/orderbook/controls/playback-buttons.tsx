import { Badge } from '@krono/ui/components/ui/badge';
import { Button } from '@krono/ui/components/ui/button';
import { format } from 'date-fns';
import { Pause, Play, StepBack, StepForward } from 'lucide-react';
import type { OrderbookControlsBaseProps } from './types';
import { formatDistanceInterval } from './utils';

export type OrderbookControlsPlaybackButtonsProps = Pick<
  OrderbookControlsBaseProps,
  'controls'
>;

export function OrderbookControlsPlaybackButtons({
  controls,
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
  } = controls;

  const now = Date.now();
  const currentTimestamp = currentData?.timestamp ?? now;

  return (
    <div className="flex flex-row items-center gap-2 justify-between w-full">
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
  );
}
