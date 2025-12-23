'use client';

import { useOrderbookPlaybackContext } from '@krono/hooks';
import { cn } from '@krono/ui/lib';
import type { ComponentPropsWithoutRef } from 'react';

export interface OrderbookControlsToolbarProps
  extends ComponentPropsWithoutRef<'div'> {
  hideWhenLive?: boolean;
}

export function OrderbookControlsToolbar({
  hideWhenLive = false,
  className,
  children,
  ...props
}: OrderbookControlsToolbarProps) {
  const { isPaused, isLive } = useOrderbookPlaybackContext();
  const shouldHide = hideWhenLive && isLive;

  return (
    <div
      className={cn(
        'absolute flex flex-col bottom-0 left-0 w-full py-3 px-4 lg:px-6',
        'bg-black/5 dark:bg-black/25',
        'transition-opacity duration-200',
        shouldHide
          ? 'opacity-0 invisible'
          : isPaused
            ? 'opacity-100 visible'
            : 'opacity-0 invisible group-hover/krono-orderbook-panel:visible group-hover/krono-orderbook-panel:opacity-100',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
