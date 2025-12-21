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

/**
 * Orderbook Table Component
 *
 * Displays market depth data in a tabular format with customizable columns,
 * depth visualization bars, and flexible styling options.
 */
const meta: Meta<typeof OrderbookTable.Root> = {
  title: 'OrderbookTable',
  component: OrderbookTable.Root,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The OrderbookTable renders bid and ask data with visual depth indicators. Supports custom column definitions, formatting, and styling through a flexible API.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: 'object',
      description: 'Array of column definitions',
    },
    type: {
      control: 'select',
      options: ['bids', 'asks'],
      description: 'Order type (bids or asks)',
      table: {
        defaultValue: { summary: 'bids' },
      },
    },
    direction: {
      control: 'select',
      options: ['ltr', 'rtl'],
      description: 'Direction for depth bars',
      table: {
        defaultValue: { summary: 'ltr' },
      },
    },
    showHeader: {
      control: 'boolean',
      description: 'Show/hide column headers',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OrderbookTable.Root>;

/**
 * Standard three-column layout.
 * Shows total, quantity, and price with default formatting.
 */
export const Standard: Story = {
  render: () => (
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
          </OrderbookControls.Root>
        </Orderbook.Panel>
      </CardContent>
    </Card>
  ),
};

/**
 * Minimal two-column layout.
 * Shows only quantity and price for compact views.
 */
export const TwoColumn: Story = {
  render: () => {
    const twoColumns: ColumnDef[] = [
      {
        id: 'quantity',
        header: 'Size',
        cell: ({ value }) => formatDigits(value.quantity),
      },
      {
        id: 'price',
        header: 'Price',
        cell: ({ value }) => formatUSD(value.price),
        cellClassName: ({ type }) =>
          type === 'bids'
            ? 'text-green-600 dark:text-green-500 font-bold'
            : 'text-red-600 dark:text-red-500 font-bold',
      },
    ];

    return (
      <Card className="flex shrink grow overflow-hidden h-[600px] w-[400px] m-4">
        <CardContent className="flex shrink grow overflow-hidden px-0 pb-px pt-2">
          <Orderbook.Panel
            defaultRowCount={15}
            enableResponsive={false}
            renderTable={(props) => (
              <OrderbookTable.Root columns={twoColumns} {...props} />
            )}
          />
        </CardContent>
      </Card>
    );
  },
};

/**
 * Extended four-column layout.
 * Includes additional calculated value column.
 */
export const FourColumn: Story = {
  render: () => {
    const fourColumns: ColumnDef[] = [
      {
        id: 'total',
        header: 'Total',
        cell: ({ value }) => formatDigits(value.total),
      },
      {
        id: 'quantity',
        header: 'Qty',
        cell: ({ value }) => formatDigits(value.quantity),
      },
      {
        id: 'price',
        header: 'Price',
        cell: ({ value }) => formatUSD(value.price),
        cellClassName: ({ type }) =>
          type === 'bids'
            ? 'font-medium text-green-500'
            : 'font-medium text-red-500',
      },
      {
        id: 'value',
        header: 'Value',
        cell: ({ value }) => formatUSD(value.price * value.quantity),
        cellClassName: 'text-muted-foreground',
      },
    ];

    return (
      <Card className="flex shrink grow overflow-hidden h-[600px] m-4">
        <CardContent className="flex shrink grow overflow-hidden px-0 pb-px pt-2">
          <Orderbook.Panel
            defaultRowCount={15}
            enableResponsive={false}
            renderTable={(props) => (
              <OrderbookTable.Root columns={fourColumns} {...props} />
            )}
          />
        </CardContent>
      </Card>
    );
  },
};

/**
 * Table without headers.
 * Clean display focusing only on data rows.
 */
export const WithoutHeaders: Story = {
  render: () => (
    <Card className="flex shrink grow overflow-hidden h-[600px] m-4">
      <CardContent className="flex shrink grow overflow-hidden px-0 pb-px pt-2">
        <Orderbook.Panel
          defaultRowCount={15}
          enableResponsive={false}
          renderTable={(props) => (
            <OrderbookTable.Root
              columns={standardColumns}
              showHeader={false}
              {...props}
            />
          )}
        />
      </CardContent>
    </Card>
  ),
};

/**
 * Custom column order.
 * Price displayed first, followed by size and cumulative.
 */
export const ReversedColumns: Story = {
  render: () => {
    const reversedColumns: ColumnDef[] = [
      {
        id: 'price',
        header: 'Price',
        cell: ({ value }) => formatUSD(value.price),
        cellClassName: ({ type }) =>
          type === 'bids'
            ? 'font-medium text-green-500 dark:text-green-600'
            : 'font-medium text-red-500 dark:text-red-600',
      },
      {
        id: 'quantity',
        header: 'Quantity',
        cell: ({ value }) => formatDigits(value.quantity),
      },
      {
        id: 'total',
        header: 'Total',
        cell: ({ value }) => formatDigits(value.total),
      },
    ];

    return (
      <Card className="flex shrink grow overflow-hidden h-[600px] m-4">
        <CardContent className="flex shrink grow overflow-hidden px-0 pb-px pt-2">
          <Orderbook.Panel
            defaultRowCount={15}
            enableResponsive={false}
            renderTable={(props) => (
              <OrderbookTable.Root columns={reversedColumns} {...props} />
            )}
          />
        </CardContent>
      </Card>
    );
  },
};

/**
 * Custom cell styling.
 * Demonstrates per-column style customization.
 */
export const CustomStyling: Story = {
  render: () => {
    const styledColumns: ColumnDef[] = [
      {
        id: 'total',
        header: 'Total',
        cell: ({ value }) => formatDigits(value.total),
        cellClassName: 'text-muted-foreground text-xs',
      },
      {
        id: 'quantity',
        header: 'Quantity',
        cell: ({ value }) => formatDigits(value.quantity),
        cellClassName: 'font-mono text-sm',
      },
      {
        id: 'price',
        header: 'Price',
        cell: ({ value }) => formatUSD(value.price),
        cellClassName: ({ type }) =>
          type === 'bids'
            ? 'font-bold text-green-600 dark:text-green-500 text-base'
            : 'font-bold text-red-600 dark:text-red-500 text-base',
      },
    ];

    return (
      <Card className="flex shrink grow overflow-hidden h-[600px] m-4">
        <CardContent className="flex shrink grow overflow-hidden px-0 pb-px pt-2">
          <Orderbook.Panel
            defaultRowCount={15}
            enableResponsive={false}
            renderTable={(props) => (
              <OrderbookTable.Root columns={styledColumns} {...props} />
            )}
          />
        </CardContent>
      </Card>
    );
  },
};

/**
 * Custom formatting with symbols.
 * Shows crypto symbol and custom number formatting.
 */
export const CustomFormatting: Story = {
  render: () => {
    const customColumns: ColumnDef[] = [
      {
        id: 'total',
        header: 'Cumulative',
        cell: ({ value }) => `Σ ${value.total.toFixed(4)}`,
        cellClassName: 'text-xs text-muted-foreground',
      },
      {
        id: 'quantity',
        header: 'Amount',
        cell: ({ value }) => `₿ ${value.quantity.toFixed(8)}`,
      },
      {
        id: 'price',
        header: 'USD',
        cell: ({ value }) =>
          `$${value.price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
        cellClassName: ({ type }) =>
          type === 'bids'
            ? 'font-medium text-green-500'
            : 'font-medium text-red-500',
      },
    ];

    return (
      <Card className="flex shrink grow overflow-hidden h-[600px] m-4">
        <CardContent className="flex shrink grow overflow-hidden px-0 pb-px pt-2">
          <Orderbook.Panel
            defaultRowCount={15}
            enableResponsive={false}
            renderTable={(props) => (
              <OrderbookTable.Root columns={customColumns} {...props} />
            )}
          >
            <OrderbookControls.Root>
              <OrderbookControls.LiveBadge />
            </OrderbookControls.Root>
          </Orderbook.Panel>
        </CardContent>
      </Card>
    );
  },
};

/**
 * RTL vs LTR direction comparison.
 * Shows how depth bars render in different directions.
 */
export const DirectionComparison: Story = {
  render: () => (
    <Card className="flex shrink grow overflow-hidden h-[600px] m-4">
      <CardContent className="flex shrink grow overflow-hidden px-0 pb-px pt-2">
        <div className="grid grid-cols-2 gap-0.5 h-full text-xs">
          <div className="space-y-2">
            <div className="text-center text-muted-foreground font-medium px-4">
              RTL (Right-to-Left)
            </div>
            <Orderbook.Panel
              defaultRowCount={12}
              enableResponsive={false}
              renderTable={(props) => (
                <OrderbookTable.Root
                  columns={standardColumns}
                  direction="rtl"
                  {...props}
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <div className="text-center text-muted-foreground font-medium px-4">
              LTR (Left-to-Right)
            </div>
            <Orderbook.Panel
              defaultRowCount={12}
              enableResponsive={false}
              renderTable={(props) => (
                <OrderbookTable.Root
                  columns={standardColumns}
                  direction="ltr"
                  {...props}
                />
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'RTL direction is typically used for bids (left side), while LTR is used for asks (right side) in traditional orderbook layouts.',
      },
    },
  },
};

/**
 * Compact table with reduced spacing.
 * Optimized for space-constrained displays.
 */
export const Compact: Story = {
  render: () => (
    <Card className="flex shrink grow overflow-hidden h-[400px] w-[400px] m-4">
      <CardContent className="flex shrink grow overflow-hidden px-0 pb-px pt-2">
        <Orderbook.Panel
          defaultRowCount={10}
          enableResponsive={false}
          renderTable={(props) => (
            <OrderbookTable.Root
              columns={standardColumns}
              className="text-[10px]"
              {...props}
            />
          )}
        />
      </CardContent>
    </Card>
  ),
};

/**
 * Side-by-side bids and asks.
 * Traditional orderbook layout with both sides visible.
 */
export const SideBySide: Story = {
  render: () => (
    <Card className="flex shrink grow overflow-hidden h-[600px] m-4">
      <CardContent className="flex shrink grow overflow-hidden px-0 pb-px pt-2">
        <div className="grid grid-cols-2 gap-0.5 h-full text-xs">
          <div className="space-y-2">
            <div className="text-center text-green-600 font-semibold px-4 pb-2 border-b">
              Bids
            </div>
            <Orderbook.Panel
              defaultRowCount={15}
              enableResponsive={false}
              renderTable={(props) => (
                <OrderbookTable.Root
                  columns={standardColumns}
                  direction="rtl"
                  type="bids"
                  {...props}
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <div className="text-center text-red-600 font-semibold px-4 pb-2 border-b">
              Asks
            </div>
            <Orderbook.Panel
              defaultRowCount={15}
              enableResponsive={false}
              renderTable={(props) => (
                <OrderbookTable.Root
                  columns={standardColumns}
                  direction="ltr"
                  type="asks"
                  {...props}
                />
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Traditional orderbook layout showing bids on the left and asks on the right, with depth bars extending toward the center.',
      },
    },
  },
};
