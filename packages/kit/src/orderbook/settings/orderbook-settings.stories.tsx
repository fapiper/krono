import { OrderbookSettings, OrderbookSettingsPopover } from '@krono/kit';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@krono/ui/components/ui/card';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Orderbook/Settings',
  component: OrderbookSettingsPopover.Root,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A collection of pre-wired configuration components for the Orderbook. These can be used individually in a custom settings panel or composed into a Popover.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OrderbookSettingsPopover.Root>;

/**
 * The standard "Gear Icon" popover menu.
 * Contains all available settings grouped by category.
 */
export const PopoverMenu: Story = {
  render: () => (
    <OrderbookSettingsPopover.Root>
      <OrderbookSettingsPopover.Trigger />
      <OrderbookSettingsPopover.Content>
        {/* Display Section */}
        <div className="pb-2 px-1">
          <h3 className="font-semibold text-sm">Display</h3>
        </div>
        <OrderbookSettings.DepthSelect />
        <OrderbookSettings.SpreadSelect />

        <OrderbookSettings.Separator />

        {/* Performance Section */}
        <div className="pb-2 px-1">
          <h3 className="font-semibold text-sm">Performance</h3>
        </div>
        <OrderbookSettings.ThrottleInput />
        <OrderbookSettings.DebounceInput />
        <OrderbookSettings.MaxHistoryInput />

        <OrderbookSettings.Separator />

        {/* Debug Section */}
        <OrderbookSettings.DebugSwitch />
        <OrderbookSettings.HistorySwitch />
      </OrderbookSettingsPopover.Content>
    </OrderbookSettingsPopover.Root>
  ),
  decorators: [
    (Story) => (
      <div className="h-[500px] w-[400px] flex items-start justify-center pt-10">
        <Story />
      </div>
    ),
  ],
};

/**
 * An example of embedding settings directly into a layout (e.g., a Sidebar or Settings Page)
 * rather than hiding them inside a popover.
 */
export const InlinePanel: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-base">Orderbook Configuration</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">
            View Options
          </h4>
          <OrderbookSettings.SpreadSelect />
          <OrderbookSettings.DepthSelect />
        </div>

        <OrderbookSettings.Separator />

        <div className="space-y-1">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">
            System
          </h4>
          <OrderbookSettings.DebugSwitch />
          <OrderbookSettings.HistorySwitch />
        </div>
      </CardContent>
    </Card>
  ),
};

/**
 * A gallery view of all available individual setting components.
 * Useful for auditing the UI states of inputs, switches, and selects.
 */
export const ComponentGallery: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Individual components can be imported and placed anywhere in the application.',
      },
    },
  },
  render: () => (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>Component Gallery</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Section 1 */}
        <div>
          <h3 className="text-sm font-bold border-b pb-2 mb-4">
            Select Inputs
          </h3>
          <div className="grid gap-4">
            <OrderbookSettings.DepthSelect />
            <OrderbookSettings.SpreadSelect />
          </div>
        </div>

        {/* Section 2 */}
        <div>
          <h3 className="text-sm font-bold border-b pb-2 mb-4">
            Numeric Inputs (Buffered)
          </h3>
          <div className="grid gap-4">
            <OrderbookSettings.ThrottleInput />
            <OrderbookSettings.DebounceInput />
            <OrderbookSettings.MaxHistoryInput />
          </div>
        </div>

        {/* Section 3 */}
        <div>
          <h3 className="text-sm font-bold border-b pb-2 mb-4">Toggles</h3>
          <div className="grid gap-4">
            <OrderbookSettings.DebugSwitch />
            <OrderbookSettings.HistorySwitch />
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};
