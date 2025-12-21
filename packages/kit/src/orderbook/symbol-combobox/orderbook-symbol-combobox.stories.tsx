import type { Meta, StoryObj } from '@storybook/react';
import { OrderbookSymbolCombobox } from '../symbol-combobox';

const meta: Meta<typeof OrderbookSymbolCombobox.Root> = {
  title: 'OrderbookSymbolCombobox',
  component: OrderbookSymbolCombobox.Root,
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <>
      <div className="p-10">
        <OrderbookSymbolCombobox.Root>
          <OrderbookSymbolCombobox.Trigger className="w-96" />
          <OrderbookSymbolCombobox.Content />
        </OrderbookSymbolCombobox.Root>
      </div>
    </>
  ),
};
