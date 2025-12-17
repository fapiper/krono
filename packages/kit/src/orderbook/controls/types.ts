import type { useOrderbookPlayback } from '@krono/hooks';
import type { HTMLAttributes } from 'react';

export type OrderbookControlsBaseProps = HTMLAttributes<HTMLDivElement> & {
  controls: ReturnType<typeof useOrderbookPlayback>;
};
