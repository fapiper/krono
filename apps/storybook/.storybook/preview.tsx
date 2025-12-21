import { Orderbook } from '@krono/kit';
import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react';

import '@krono/ui/globals.css';
import '@krono/kit/globals.css';

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    (Story) => (
      <Orderbook.RootProvider config={{ symbol: 'BTC/USD' }}>
        <Story />
      </Orderbook.RootProvider>
    ),
  ],
};

export default preview;
