import { Badge } from '@krono/ui/components/ui/badge';
import { cn } from '@krono/ui/lib';
import type { OrderbookControlsBaseProps } from './types';

export type OrderbookControlsLiveBadgeProps = Pick<
  OrderbookControlsBaseProps,
  'controls'
>;

export function OrderbookControlsLiveBadge({
  controls,
}: OrderbookControlsLiveBadgeProps) {
  const { isLive, goToLive } = controls;

  return (
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
  );
}
