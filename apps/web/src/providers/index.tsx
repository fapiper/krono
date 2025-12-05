import OrderbookProvider from '@/providers/Orderbook';
import QueryClientProvider from '@/providers/QueryClient';
import { ThemeScriptProvider } from '@/providers/ThemeScript';
import type { PropsWithChildren } from 'react';

export default function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <ThemeScriptProvider />
      <QueryClientProvider>
        <OrderbookProvider>{children}</OrderbookProvider>
      </QueryClientProvider>
    </>
  );
}
