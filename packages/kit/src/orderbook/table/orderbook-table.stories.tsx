import {
  type ColumnDef,
  formatDigits,
  formatPrice,
  Orderbook,
  OrderbookControls,
  OrderbookTable,
} from '@krono/kit';
import { Card, CardContent } from '@krono/ui/components/ui/card';
import type { Meta, StoryObj } from '@storybook/react';

const columnsStandard: ColumnDef[] = [
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
    cell: ({ value }) => formatPrice(value.price),
    cellClassName: ({ type }) =>
      type === 'bids'
        ? 'font-medium text-green-500 dark:text-green-600'
        : 'font-medium text-red-500 dark:text-red-600',
  },
];

const columnsCompact: ColumnDef[] = [
  {
    id: 'quantity',
    header: 'Size',
    cell: ({ value }) => formatDigits(value.quantity),
  },
  {
    id: 'price',
    header: 'Price',
    cell: ({ value }) => formatPrice(value.price),
    cellClassName: ({ type }) =>
      type === 'bids' ? 'text-green-600 font-bold' : 'text-red-600 font-bold',
  },
];

const columnsDetailed: ColumnDef[] = [
  ...columnsStandard,
  {
    id: 'value',
    header: 'Value',
    cell: ({ value }) => formatPrice(value.price * value.quantity),
    cellClassName: 'text-muted-foreground',
  },
];

const meta: Meta<typeof OrderbookTable.Root> = {
  title: 'Orderbook/Table',
  component: OrderbookTable.Root,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story, context) => (
      <div className="flex h-[600px] w-full p-6 bg-background/50">
        <Card className="flex shrink grow overflow-hidden shadow-sm">
          <CardContent className="flex shrink grow overflow-hidden px-0 pb-px pt-2">
            <Orderbook.Panel
              defaultRowCount={15}
              enableResponsive={false}
              renderTable={(props) => (
                <Story args={{ ...context.args, ...props }} />
              )}
            >
              <OrderbookControls.Root>
                <OrderbookControls.LiveBadge />
              </OrderbookControls.Root>
            </Orderbook.Panel>
          </CardContent>
        </Card>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof OrderbookTable.Root>;

// --- Stories ---

export const Standard: Story = {
  args: {
    columns: columnsStandard,
  },
};

export const Compact: Story = {
  args: {
    columns: columnsCompact,
  },
  parameters: {
    docs: { description: { story: 'Minimal two-column layout for sidebars.' } },
  },
};

export const Detailed: Story = {
  args: {
    columns: columnsDetailed,
  },
};

export const NoHeader: Story = {
  args: {
    columns: columnsStandard,
    showHeader: false,
  },
};

export const RightToLeft: Story = {
  args: {
    columns: columnsStandard,
    direction: 'rtl',
  },
  parameters: {
    docs: {
      description: { story: 'Standard for Bids (depth growing leftwards).' },
    },
  },
};

/**
 * Custom story for Side-by-Side layout.
 * We override the main decorator here because we need a specific Grid layout
 * with two Panels (one for Bids, one for Asks).
 */
export const SideBySide: Story = {
  decorators: [
    (Story) => (
      <div className="flex h-[600px] w-full p-6 bg-background/50">
        <Card className="flex shrink grow overflow-hidden shadow-sm">
          <CardContent className="flex shrink grow overflow-hidden p-0">
            <Story />
          </CardContent>
        </Card>
      </div>
    ),
  ],
  render: () => (
    <div className="grid grid-cols-2 gap-px h-full bg-border">
      {/* Left: Bids */}
      <div className="bg-background flex flex-col">
        <div className="text-center text-xs font-semibold text-green-600 py-1 border-b">
          Bids
        </div>
        <Orderbook.Panel
          defaultRowCount={15}
          renderTable={(props) => (
            <OrderbookTable.Root
              {...props}
              columns={columnsStandard}
              direction="rtl"
              type="bids"
            />
          )}
        />
      </div>

      {/* Right: Asks */}
      <div className="bg-background flex flex-col">
        <div className="text-center text-xs font-semibold text-red-600 py-1 border-b">
          Asks
        </div>
        <Orderbook.Panel
          defaultRowCount={15}
          renderTable={(props) => (
            <OrderbookTable.Root
              {...props}
              columns={columnsStandard}
              direction="ltr"
              type="asks"
            />
          )}
        />
      </div>
    </div>
  ),
};
