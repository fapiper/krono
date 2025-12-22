import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';

import './globals.css';

import { cn } from '@krono/ui/lib';
import LayoutRoot from '@/app/_components/layout-root';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Krono - Orderbook Visualizer',
  description: 'Built by Fabian Piper<mail@fabianpiper.com>',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning={true} data-theme="dark">
      <body className={cn(inter.className)}>
        <ThemeProvider attribute="class" defaultTheme={'dark'}>
          <LayoutRoot>{children}</LayoutRoot>
        </ThemeProvider>
      </body>
    </html>
  );
}
