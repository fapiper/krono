import { OrderbookSettingsPopoverContent } from './content';
import { OrderbookSettingsPopoverRoot } from './root';
import { OrderbookSettingsPopoverTrigger } from './trigger';

export type { OrderbookSettingsPopoverContentProps } from './content';
export type { OrderbookSettingsPopoverRootProps } from './root';
export type { OrderbookSettingsPopoverTriggerProps } from './trigger';

export const OrderbookSettingsPopover = {
  Root: OrderbookSettingsPopoverRoot,
  Trigger: OrderbookSettingsPopoverTrigger,
  Content: OrderbookSettingsPopoverContent,
};
