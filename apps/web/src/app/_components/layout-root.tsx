'use client';

import { Orderbook } from '@krono/kit';
import { cn } from '@krono/ui/src/lib';
import type { HTMLAttributes } from 'react';
import LayoutFooter from '@/app/_components/layout-footer';
import LayoutHeader from '@/app/_components/layout-header';

export type LayoutRootProps = HTMLAttributes<HTMLDivElement>;

export default function LayoutRoot({
  children,
  className,
  ...props
}: LayoutRootProps) {
  return (
    <Orderbook.RootProvider config={{ symbol: 'BTC/USD', debug: true }}>
      <div className={cn('flex flex-col lg:h-screen', className)} {...props}>
        <LayoutHeader />
        <main className={'flex flex-col shrink grow overflow-hidden px-4 pb-4'}>
          {children}
        </main>
        <LayoutFooter />
      </div>
    </Orderbook.RootProvider>
  );
}
