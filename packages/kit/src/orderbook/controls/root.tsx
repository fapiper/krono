'use client';

import { cn } from '@ui/lib';
import { OrderbookControlsPlaybackButtons } from './playback-buttons';
import { OrderbookControlsTimeline } from './timeline';
import type { OrderbookControlsBaseProps } from './types';

export type OrderbookControlsRootProps = OrderbookControlsBaseProps;

export function OrderbookControlsRoot({
  className,
  children,
  controls,
  ...props
}: OrderbookControlsRootProps) {
  const { isPaused } = controls;

  const defaultChildren = (
    <>
      <OrderbookControlsTimeline controls={controls} />
      <OrderbookControlsPlaybackButtons controls={controls} />
    </>
  );

  return (
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
      {children || defaultChildren}
    </div>
  );
}
