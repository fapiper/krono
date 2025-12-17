import { OrderbookControlsLiveBadge } from './live-badge';
import { OrderbookControlsPlaybackButtons } from './playback-buttons';
import { OrderbookControlsRoot } from './root';
import { OrderbookControlsTimeline } from './timeline';

export type { OrderbookControlsLiveBadgeProps } from './live-badge';
export type { OrderbookControlsPlaybackButtonsProps } from './playback-buttons';
export type { OrderbookControlsRootProps } from './root';
export type { OrderbookControlsTimelineProps } from './timeline';

export * from './types';

export const OrderbookControls = {
  LiveBadge: OrderbookControlsLiveBadge,
  PlaybackButtons: OrderbookControlsPlaybackButtons,
  Root: OrderbookControlsRoot,
  Timeline: OrderbookControlsTimeline,
};
