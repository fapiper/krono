import {
  type ColumnDef,
  formatDigits,
  formatUSD,
  Orderbook,
  OrderbookControls,
  OrderbookTable,
} from '@krono/kit';
import { Card, CardContent } from '@krono/ui/components/ui/card';
import type { Meta, StoryObj } from '@storybook/react';

const standardColumns: ColumnDef[] = [
  {
    id: 'total',
    header: 'Total',
    cell: ({ value }) => formatDigits(value.total),
  },
  {
    id: 'quantity',
    header: 'Quantity',
    cell: ({ value }) => formatDigits(value.quantity),
  },
  {
    id: 'price',
    header: 'Price',
    cell: ({ value }) => formatUSD(value.price),
    cellClassName: ({ type }) =>
      type === 'bids'
        ? 'font-medium text-green-500 dark:text-green-600'
        : 'font-medium text-red-500 dark:text-red-600',
  },
];

// ============================================================================
// LiveBadge Stories
// ============================================================================

/**
 * Live Badge Component
 *
 * A status indicator that shows whether the orderbook is displaying live data
 * or is in "time travel" mode showing historical data.
 */
const liveBadgeMeta: Meta<typeof OrderbookControls.LiveBadge> = {
  title: 'Orderbook/Controls/LiveBadge',
  component: OrderbookControls.LiveBadge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Displays the connection status with an animated indicator. When live, shows a pulsing red dot. When viewing historical data, shows a gray dot and is clickable to return to live mode.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    children: {
      control: false,
      description: 'Custom render function or ReactNode',
    },
  },
};

export default liveBadgeMeta;
type LiveBadgeStory = StoryObj<typeof OrderbookControls.LiveBadge>;

/**
 * Default live badge with standard styling and behavior.
 * Automatically reflects the current playback state.
 */
export const Default: LiveBadgeStory = {
  render: () => (
    <div className="p-8 bg-muted rounded-lg relative min-w-[200px] min-h-[100px] flex items-center justify-center">
      <Orderbook.Panel defaultRowCount={0} renderTable={() => null}>
        <OrderbookControls.Root>
          <OrderbookControls.LiveBadge />
        </OrderbookControls.Root>
      </Orderbook.Panel>
    </div>
  ),
};

/**
 * Custom badge with render function.
 * Demonstrates how to customize the badge content while maintaining functionality.
 */
export const CustomContent: LiveBadgeStory = {
  render: () => (
    <div className="p-8 bg-muted rounded-lg relative min-w-[200px] min-h-[100px] flex items-center justify-center">
      <Orderbook.Panel defaultRowCount={0} renderTable={() => null}>
        <OrderbookControls.Root>
          <OrderbookControls.LiveBadge>
            {({ isLive, timeBehindLive }) => (
              <>
                {isLive
                  ? '🟢 Real-time'
                  : `⏱️ ${Math.floor(timeBehindLive / 1000)}s behind`}
              </>
            )}
          </OrderbookControls.LiveBadge>
        </OrderbookControls.Root>
      </Orderbook.Panel>
    </div>
  ),
};

/**
 * Live badge in context with full orderbook.
 * Shows typical placement in the top-right corner.
 */
export const InContext: LiveBadgeStory = {
  render: () => (
    <Card className="flex shrink grow overflow-hidden h-[400px] w-[600px]">
      <CardContent className="flex shrink grow overflow-hidden px-0 pb-px pt-2">
        <Orderbook.Panel
          defaultRowCount={10}
          enableResponsive={false}
          renderTable={(props) => (
            <OrderbookTable.Root columns={standardColumns} {...props} />
          )}
        >
          <OrderbookControls.Root>
            <OrderbookControls.LiveBadge />
          </OrderbookControls.Root>
        </Orderbook.Panel>
      </CardContent>
    </Card>
  ),
};

// ============================================================================
// PlaybackButtons Stories
// ============================================================================

/**
 * Playback Buttons Component
 *
 * VCR-style controls for navigating through orderbook history.
 * Includes step backward, play/pause, step forward, and timestamp display.
 */
export const playbackButtonsMeta: Meta<
  typeof OrderbookControls.PlaybackButtons
> = {
  title: 'Orderbook/Controls/PlaybackButtons',
  component: OrderbookControls.PlaybackButtons,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Provides play/pause and step controls for time-traveling through orderbook snapshots. Displays current timestamp and time behind live when not in real-time mode.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showTimestamp: {
      control: 'boolean',
      description: 'Show/hide the timestamp badge',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    timestampFormat: {
      control: 'text',
      description: 'date-fns format string for timestamp display',
      table: {
        defaultValue: { summary: '"HH:mm:ss"' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

type PlaybackButtonsStory = StoryObj<typeof OrderbookControls.PlaybackButtons>;

/**
 * Default playback buttons with timestamp.
 * Shows all controls in their standard configuration.
 */
export const DefaultPlayback: PlaybackButtonsStory = {
  args: {
    showTimestamp: true,
    timestampFormat: 'HH:mm:ss',
  },
  render: (args) => (
    <Card className="w-[600px] p-4">
      <Orderbook.Panel defaultRowCount={0} renderTable={() => null}>
        <OrderbookControls.Root>
          <OrderbookControls.PlaybackButtons {...args} />
        </OrderbookControls.Root>
      </Orderbook.Panel>
    </Card>
  ),
};

/**
 * Playback buttons without timestamp.
 * Minimal version showing only transport controls.
 */
export const WithoutTimestamp: PlaybackButtonsStory = {
  args: {
    showTimestamp: false,
  },
  render: (args) => (
    <Card className="w-[400px] p-4">
      <Orderbook.Panel defaultRowCount={0} renderTable={() => null}>
        <OrderbookControls.Root>
          <OrderbookControls.PlaybackButtons {...args} />
        </OrderbookControls.Root>
      </Orderbook.Panel>
    </Card>
  ),
};

/**
 * Custom timestamp format.
 * Demonstrates full date-time formatting.
 */
export const CustomTimestampFormat: PlaybackButtonsStory = {
  args: {
    showTimestamp: true,
    timestampFormat: 'yyyy-MM-dd HH:mm:ss',
  },
  render: (args) => (
    <Card className="w-[700px] p-4">
      <Orderbook.Panel defaultRowCount={0} renderTable={() => null}>
        <OrderbookControls.Root>
          <OrderbookControls.PlaybackButtons {...args} />
        </OrderbookControls.Root>
      </Orderbook.Panel>
    </Card>
  ),
};

/**
 * Playback buttons in context with orderbook.
 * Shows typical placement within the toolbar at the bottom.
 */
export const PlaybackInContext: PlaybackButtonsStory = {
  args: {
    showTimestamp: true,
  },
  render: (args) => (
    <Card className="flex shrink grow overflow-hidden h-[500px] w-[700px]">
      <CardContent className="flex shrink grow overflow-hidden px-0 pb-px pt-2">
        <Orderbook.Panel
          defaultRowCount={12}
          enableResponsive={false}
          renderTable={(props) => (
            <OrderbookTable.Root columns={standardColumns} {...props} />
          )}
        >
          <OrderbookControls.Root>
            <OrderbookControls.LiveBadge />
            <OrderbookControls.Toolbar hideWhenLive={false}>
              <OrderbookControls.PlaybackButtons {...args} />
            </OrderbookControls.Toolbar>
          </OrderbookControls.Root>
        </Orderbook.Panel>
      </CardContent>
    </Card>
  ),
};

// ============================================================================
// Timeline Stories
// ============================================================================

/**
 * Timeline Component
 *
 * A slider control for scrubbing through orderbook history.
 * Shows buffer progress and allows direct navigation to any point in time.
 */
export const timelineMeta: Meta<typeof OrderbookControls.Timeline> = {
  title: 'Orderbook/Controls/Timeline',
  component: OrderbookControls.Timeline,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A horizontal slider for navigating through orderbook snapshots. Displays a visual buffer indicator showing loading progress for upcoming frames.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showBuffer: {
      control: 'boolean',
      description: 'Show/hide the buffer progress indicator',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

type TimelineStory = StoryObj<typeof OrderbookControls.Timeline>;

/**
 * Default timeline with buffer indicator.
 * Shows progress as data loads ahead of the current position.
 */
export const DefaultTimeline: TimelineStory = {
  args: {
    showBuffer: true,
  },
  render: (args) => (
    <Card className="w-[600px] p-4">
      <Orderbook.Panel defaultRowCount={0} renderTable={() => null}>
        <OrderbookControls.Root>
          <div className="relative pt-4">
            <OrderbookControls.Timeline {...args} />
          </div>
        </OrderbookControls.Root>
      </Orderbook.Panel>
    </Card>
  ),
};

/**
 * Timeline without buffer indicator.
 * Clean version without visual loading feedback.
 */
export const WithoutBuffer: TimelineStory = {
  args: {
    showBuffer: false,
  },
  render: (args) => (
    <Card className="w-[600px] p-4">
      <Orderbook.Panel defaultRowCount={0} renderTable={() => null}>
        <OrderbookControls.Root>
          <div className="relative pt-4">
            <OrderbookControls.Timeline {...args} />
          </div>
        </OrderbookControls.Root>
      </Orderbook.Panel>
    </Card>
  ),
};

/**
 * Timeline in context with full controls.
 * Typical placement with playback buttons in the toolbar.
 */
export const TimelineInContext: TimelineStory = {
  args: {
    showBuffer: true,
  },
  render: (args) => (
    <Card className="flex shrink grow overflow-hidden h-[500px] w-[700px]">
      <CardContent className="flex shrink grow overflow-hidden px-0 pb-px pt-2">
        <Orderbook.Panel
          defaultRowCount={12}
          enableResponsive={false}
          renderTable={(props) => (
            <OrderbookTable.Root columns={standardColumns} {...props} />
          )}
        >
          <OrderbookControls.Root>
            <OrderbookControls.LiveBadge />
            <OrderbookControls.Toolbar hideWhenLive={false}>
              <OrderbookControls.Timeline {...args} />
              <OrderbookControls.PlaybackButtons />
            </OrderbookControls.Toolbar>
          </OrderbookControls.Root>
        </Orderbook.Panel>
      </CardContent>
    </Card>
  ),
};

// ============================================================================
// Toolbar Stories
// ============================================================================

/**
 * Toolbar Component
 *
 * Container for playback controls that appears at the bottom of the orderbook.
 * Automatically hides when live and shows on hover, or can be configured to always be visible.
 */
export const toolbarMeta: Meta<typeof OrderbookControls.Toolbar> = {
  title: 'Orderbook/Controls/Toolbar',
  component: OrderbookControls.Toolbar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A semi-transparent overlay at the bottom of the orderbook containing playback controls. Visibility is controlled by live state and hover interactions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    hideWhenLive: {
      control: 'boolean',
      description: 'Hide toolbar when in live mode',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

type ToolbarStory = StoryObj<typeof OrderbookControls.Toolbar>;

/**
 * Default toolbar behavior.
 * Hides when live, shows on hover or when paused.
 */
export const DefaultToolbar: ToolbarStory = {
  args: {
    hideWhenLive: true,
  },
  render: (args) => (
    <Card className="flex shrink grow overflow-hidden h-[600px] m-4">
      <CardContent className="flex shrink grow overflow-hidden px-0 pb-px pt-2">
        <Orderbook.Panel
          defaultRowCount={15}
          enableResponsive={false}
          renderTable={(props) => (
            <OrderbookTable.Root columns={standardColumns} {...props} />
          )}
        >
          <OrderbookControls.Root>
            <OrderbookControls.LiveBadge />
            <OrderbookControls.Toolbar {...args}>
              <OrderbookControls.PlaybackButtons />
              <OrderbookControls.Timeline />
            </OrderbookControls.Toolbar>
          </OrderbookControls.Root>
        </Orderbook.Panel>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Hover over the orderbook to reveal the toolbar. It automatically hides when in live mode to reduce visual clutter.',
      },
    },
  },
};

/**
 * Always visible toolbar.
 * Never hides, useful for demos or training.
 */
export const AlwaysVisible: ToolbarStory = {
  args: {
    hideWhenLive: false,
  },
  render: (args) => (
    <Card className="flex shrink grow overflow-hidden h-[600px] m-4">
      <CardContent className="flex shrink grow overflow-hidden px-0 pb-px pt-2">
        <Orderbook.Panel
          defaultRowCount={15}
          enableResponsive={false}
          renderTable={(props) => (
            <OrderbookTable.Root columns={standardColumns} {...props} />
          )}
        >
          <OrderbookControls.Root>
            <OrderbookControls.LiveBadge />
            <OrderbookControls.Toolbar {...args}>
              <OrderbookControls.PlaybackButtons />
              <OrderbookControls.Timeline />
            </OrderbookControls.Toolbar>
          </OrderbookControls.Root>
        </Orderbook.Panel>
      </CardContent>
    </Card>
  ),
};

/**
 * Minimal toolbar with only timeline.
 * Demonstrates flexible content composition.
 */
export const MinimalToolbar: ToolbarStory = {
  args: {
    hideWhenLive: true,
  },
  render: (args) => (
    <Card className="flex shrink grow overflow-hidden h-[600px] m-4">
      <CardContent className="flex shrink grow overflow-hidden px-0 pb-px pt-2">
        <Orderbook.Panel
          defaultRowCount={15}
          enableResponsive={false}
          renderTable={(props) => (
            <OrderbookTable.Root columns={standardColumns} {...props} />
          )}
        >
          <OrderbookControls.Root>
            <OrderbookControls.Toolbar {...args}>
              <OrderbookControls.Timeline />
            </OrderbookControls.Toolbar>
          </OrderbookControls.Root>
        </Orderbook.Panel>
      </CardContent>
    </Card>
  ),
};
