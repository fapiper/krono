import type { Meta, StoryObj } from '@storybook/react';
import { OrderbookSettings, OrderbookSettingsPopover } from '../settings';

const meta: Meta<typeof OrderbookSettingsPopover.Root> = {
  title: 'OrderbookSettings',
  component: OrderbookSettingsPopover.Root,
  tags: ['autodocs'],
};

export default meta;

export const FullPopover: StoryObj = {
  render: () => (
    <>
      <div className="p-4">
        <OrderbookSettingsPopover.Root>
          <OrderbookSettingsPopover.Trigger />
          <OrderbookSettingsPopover.Content>
            <div className="pb-2 px-1">
              <h3 className="font-semibold text-sm">Display</h3>
            </div>
            <OrderbookSettings.DepthSelect />
            <OrderbookSettings.SpreadSelect />

            <OrderbookSettings.Separator />

            <div className="pb-2 px-1">
              <h3 className="font-semibold text-sm">Performance</h3>
            </div>
            <OrderbookSettings.ThrottleInput />
            <OrderbookSettings.DebounceInput />

            <OrderbookSettings.Separator />

            <OrderbookSettings.DebugSwitch />
            <OrderbookSettings.HistorySwitch />
          </OrderbookSettingsPopover.Content>
        </OrderbookSettingsPopover.Root>
      </div>
    </>
  ),
};

export const InlineSettings: StoryObj = {
  render: () => (
    <>
      <div className="w-80 p-4 border rounded-lg m-4 space-y-2">
        <h4 className="text-sm font-bold mb-4">Sidebar Settings</h4>
        <OrderbookSettings.SpreadSelect />
        <OrderbookSettings.DepthSelect />
        <OrderbookSettings.Separator />
        <OrderbookSettings.DebugSwitch />
      </div>
    </>
  ),
};
