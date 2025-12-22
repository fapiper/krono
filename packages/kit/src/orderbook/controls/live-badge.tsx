import {
  type UseOrderbookPlaybackReturnType,
  useOrderbookPlaybackContext,
} from '@krono/hooks';
import { Badge } from '@krono/ui/components/ui/badge';
import { cn } from '@krono/ui/lib';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export type OrderbookControlsLiveBadgeProps = Omit<
  ComponentPropsWithoutRef<typeof Badge>,
  'children'
> & {
  children?: ((props: UseOrderbookPlaybackReturnType) => ReactNode) | ReactNode;
};

export function OrderbookControlsLiveBadge({
  className,
  children,
  ...props
}: OrderbookControlsLiveBadgeProps) {
  const controls = useOrderbookPlaybackContext();
  const { isLive, goToLive } = controls;

  return (
    <Badge
      variant="outline"
      size="xs"
      className={cn(
        'absolute right-1 lg:right-6 top-1 lg:top-1 bg-background',
        !isLive &&
          'opacity-50 hover:opacity-100 cursor-pointer transition-opacity',
        className,
      )}
      onClick={() => !isLive && goToLive()}
      {...props}
    >
      {!children ? (
        <OrderbookControlsLiveBadgeDefaultContent {...controls} />
      ) : typeof children === 'function' ? (
        children(controls)
      ) : (
        children
      )}
    </Badge>
  );
}

function OrderbookControlsLiveBadgeDefaultContent({
  isLive,
}: UseOrderbookPlaybackReturnType) {
  const ringClassName =
    'absolute inline-flex h-full w-full rounded-full opacity-75';
  const dotClassName = 'relative inline-flex size-1.5 rounded-full';
  return (
    <>
      <span className="relative flex size-1.5 mr-1.5">
        {isLive ? (
          <>
            <span className={cn(ringClassName, 'animate-ping bg-red-500')} />
            <span className={cn(dotClassName, 'bg-red-600')} />
          </>
        ) : (
          <>
            <span className={cn(ringClassName, 'bg-gray-500')} />
            <span className={cn(dotClassName, 'bg-gray-600')} />
          </>
        )}
      </span>
      {isLive ? 'Live' : 'Travelling'}
    </>
  );
}
