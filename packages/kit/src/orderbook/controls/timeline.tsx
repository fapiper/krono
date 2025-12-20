import { useOrderbookPlaybackContext } from '@krono/hooks';
import { Slider } from '@krono/ui/components/ui/slider';
import { cn } from '@krono/ui/lib';
import type { ComponentPropsWithoutRef } from 'react';

export type OrderbookControlsTimelineProps = ComponentPropsWithoutRef<'div'> & {
  showBuffer?: boolean;
};

export function OrderbookControlsTimeline({
  showBuffer = true,
  className,
  ...props
}: OrderbookControlsTimelineProps) {
  const {
    isLive,
    goToIndex,
    index: currentIndex,
    historyLength,
    nextFrameInfo,
  } = useOrderbookPlaybackContext();

  const shouldShowBuffer = showBuffer && !isLive && nextFrameInfo;
  const bufferWidth = shouldShowBuffer ? nextFrameInfo.progress * 100 : 0;
  const sliderMax = Math.max(0, historyLength - 1);
  const sliderValue = isLive ? sliderMax : currentIndex;

  return (
    <div
      className={cn(
        'absolute top-0 left-0 transform -translate-y-1/2 flex w-full',
        className,
      )}
      {...props}
    >
      {shouldShowBuffer && (
        <div
          className="absolute left-0 top-0 h-full bg-black/15 dark:bg-white/15 pointer-events-none"
          style={{
            width: `${bufferWidth}%`,
            left: `${(sliderValue / sliderMax) * 100}%`,
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
        onValueChange={(values) => {
          if (values[0]) {
            goToIndex(values[0]);
          }
        }}
      />
    </div>
  );
}
