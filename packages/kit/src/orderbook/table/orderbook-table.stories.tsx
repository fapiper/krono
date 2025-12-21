import type { PriceLevel } from '@krono/core';
import type { Meta, StoryObj } from '@storybook/react';
import { type ColumnDef, formatDigits, formatUSD } from '../../orderbook';
import { OrderbookTableRoot } from './root';
import { OrderbookTableSkeleton } from './skeleton';

const generateData = (
  type: 'bids' | 'asks',
  count: number = 15,
): PriceLevel[] => {
  const startPrice = type === 'bids' ? 50000 : 50001;
  const data: PriceLevel[] = [];
  let currentTotal = 0;

  for (let i = 0; i < count; i++) {
    const price = type === 'bids' ? startPrice - i * 50 : startPrice + i * 50;
    const quantity = Math.random() * 2 + 0.1;
    currentTotal += quantity;
    data.push({
      price,
      quantity,
      total: currentTotal,
    });
  }
  return data;
};

const defaultColumns: ColumnDef[] = [
  {
    id: 'price',
    header: 'Price (USD)',
    className: 'text-left',
    cell: ({ value }) => formatUSD(value.price),
    cellClassName: ({ type }) =>
      type === 'bids' ? 'text-green-500' : 'text-red-500',
  },
  {
    id: 'quantity',
    header: 'Qty',
    className: 'text-right',
    cell: ({ value }) => formatDigits(value.quantity),
  },
  {
    id: 'total',
    header: 'Total',
    className: 'text-right text-zinc-500',
    cell: ({ value }) => formatDigits(value.total),
  },
];

const meta: Meta<typeof OrderbookTableRoot> = {
  title: 'Orderbook/Table',
  component: OrderbookTableRoot,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['bids', 'asks'],
    },
    direction: {
      control: 'radio',
      options: ['ltr', 'rtl'],
    },
    showHeader: { control: 'boolean' },
    maxTotal: { control: 'number' },
  },
  args: {
    columns: defaultColumns,
    showHeader: true,
    direction: 'ltr',
  },
  decorators: [
    (Story) => (
      <div className="w-[400px] border rounded-md bg-background p-2">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof OrderbookTableRoot>;

export const Bids: Story = {
  args: {
    type: 'bids',
    data: generateData('bids'),
  },
};

export const Asks: Story = {
  args: {
    type: 'asks',
    data: generateData('asks'),
    columns: [...defaultColumns],
  },
};

export const RightToLeft: Story = {
  args: {
    type: 'bids',
    direction: 'rtl',
    data: generateData('bids'),
  },
};

export const CustomBarColors: Story = {
  args: {
    type: 'bids',
    data: generateData('bids'),
    rowProps: {
      barProps: {
        color: 'rgba(59, 130, 246, 0.2)',
      },
    },
  },
};

export const DenseLayout: Story = {
  args: {
    type: 'bids',
    data: generateData('bids', 25), // More rows
    className: 'text-[10px]', // Smaller text
    rowProps: {
      className: 'py-0', // Tighter padding
    },
  },
};

export const CustomRowRenderer: Story = {
  args: {
    type: 'bids',
    data: generateData('bids', 5),
    renderRow: (props, index) => (
      <div className="flex justify-between p-2 border-b text-xs hover:bg-muted">
        <span>Custom Row {index}</span>
        <strong>{props.children}</strong>
      </div>
    ),
  },
};

export const LoadingState: Story = {
  render: () => <OrderbookTableSkeleton rows={10} columns={3} />,
};
