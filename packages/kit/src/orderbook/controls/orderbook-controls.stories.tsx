import {
  formatDigits,
  formatPrice,
  Orderbook,
  OrderbookControls,
  OrderbookTable,
  type OrderbookTableColumns,
} from '@krono/kit';
import { Card, CardContent } from '@krono/ui/components/ui/card';
import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';

// --- Shared Setup ---

const simpleColumns: OrderbookTableColumns = {
  total: {
    label: 'Total',
    children: ({ value }) => formatDigits(value.total),
  },
  quantity: {
    label: 'Quantity',
    children: ({ value }) => formatDigits(value.quantity),
  },
  price: {
    label: 'Price',
    className: 'font-semibold',
    children: ({ value }) => formatPrice(value.price, 4),
  },
};

/**
 * A shared wrapper to give controls a realistic environment.
 * It renders a small table in the background so the controls (like Timeline)
 * have actual data context to interact with.
 */
const ControlsWrapper = ({
  children,
  className = 'h-[400px] w-[600px]',
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={`p-6 ${className}`}>
    <Card className="flex shrink grow overflow-hidden h-full shadow-sm">
      <CardContent className="flex shrink grow overflow-hidden px-0 pb-px pt-2">
        <Orderbook.Panel
          defaultRowCount={10}
          enableResponsive={false}
          renderTable={(props) => (
            <OrderbookTable.Root columns={simpleColumns} {...props} />
          )}
        >
          <OrderbookControls.Root>{children}</OrderbookControls.Root>
        </Orderbook.Panel>
      </CardContent>
    </Card>
  </div>
);

const meta: Meta = {
  title: 'Orderbook/Controls',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;

// ============================================================================
// 1. Live Badge
// ============================================================================

export const LiveBadge: StoryObj<typeof OrderbookControls.LiveBadge> = {
  render: (args) => (
    <ControlsWrapper className="h-[200px] w-[300px]">
      <OrderbookControls.LiveBadge {...args} />
    </ControlsWrapper>
  ),
};

export const LiveBadgeCustom: StoryObj<typeof OrderbookControls.LiveBadge> = {
  render: () => (
    <ControlsWrapper className="h-[200px] w-[300px]">
      <OrderbookControls.LiveBadge>
        {({ isLive, timeBehindLive }) => (
          <div className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded border bg-background/80 backdrop-blur">
            {isLive
              ? '● Realtime Data'
              : `↺ Replay (${timeBehindLive}ms delay)`}
          </div>
        )}
      </OrderbookControls.LiveBadge>
    </ControlsWrapper>
  ),
};

// ============================================================================
// 2. Playback Buttons
// ============================================================================

export const PlaybackButtons: StoryObj<
  typeof OrderbookControls.PlaybackButtons
> = {
  args: {
    showTimestamp: true,
    timestampFormat: 'HH:mm:ss',
  },
  render: (args) => (
    <ControlsWrapper className="h-[200px] w-[500px]">
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <div className="bg-muted/80 p-1.5 rounded-lg border shadow-sm">
          <OrderbookControls.PlaybackButtons {...args} />
        </div>
      </div>
    </ControlsWrapper>
  ),
};

// ============================================================================
// 3. Timeline
// ============================================================================

export const Timeline: StoryObj<typeof OrderbookControls.Timeline> = {
  args: {
    showBuffer: true,
  },
  render: (args) => (
    <ControlsWrapper className="h-[250px] w-[600px]">
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/90 border-t">
        <OrderbookControls.Timeline {...args} />
      </div>
    </ControlsWrapper>
  ),
};

// ============================================================================
// 4. Toolbar (Composition)
// ============================================================================

export const ToolbarFull: StoryObj<typeof OrderbookControls.Toolbar> = {
  args: {
    hideWhenLive: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The Toolbar composes PlaybackButtons and Timeline into a cohesive floating control bar.',
      },
    },
  },
  render: (args) => (
    <ControlsWrapper className="h-[500px] w-full min-w-[700px]">
      <OrderbookControls.LiveBadge />
      <OrderbookControls.Toolbar {...args}>
        <OrderbookControls.PlaybackButtons showTimestamp />
        <OrderbookControls.Timeline showBuffer />
      </OrderbookControls.Toolbar>
    </ControlsWrapper>
  ),
};
