import { Slider } from '@krono/ui/components/ui/slider';
import type { OrderbookControlsBaseProps } from './types';

export type OrderbookControlsTimelineProps = Pick<
  OrderbookControlsBaseProps,
  'controls'
>;

export function OrderbookControlsTimeline({
  controls,
}: OrderbookControlsTimelineProps) {
  const {
    isLive,
    goToIndex,
    index: currentIndex,
    historyLength,
    nextFrameInfo,
  } = controls;

  const showBuffer = !isLive && nextFrameInfo;
  const bufferWidth = showBuffer ? nextFrameInfo.progress * 100 : 0;

  const sliderMax = Math.max(0, historyLength - 1);
  const sliderValue = isLive ? sliderMax : currentIndex;

  return (
    <div className="absolute top-0 left-0 transform -translate-y-1/2 flex w-full">
      {showBuffer && (
        <div
          className={
            'absolute left-0 top-0 h-1 w-full pointer-events-none overflow-hidden'
          }
        >
          <div
            className="absolute left-0 top-0 h-full bg-black/15 dark:bg-white/15"
            style={{
              width: `${bufferWidth}%`,
              left: `${(sliderValue / sliderMax) * 100}%`,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1,
            }}
          />
        </div>
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
  );
}
