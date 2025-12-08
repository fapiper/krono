import OrderbookProvider from '@/providers/Orderbook';
import { ThemeScriptProvider } from '@/providers/ThemeScript';
import type { PropsWithChildren } from 'react';

export default function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <ThemeScriptProvider />
      <OrderbookProvider>{children}</OrderbookProvider>
    </>
  );
}
