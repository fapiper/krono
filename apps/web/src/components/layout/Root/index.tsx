'use client';

import { Orderbook } from '@krono/kit';
import { cn } from '@krono/ui/lib';
import type { HTMLAttributes } from 'react';
import LayoutFooter from '@/components/layout/Footer';
import LayoutHeader from '@/components/layout/Header';
import LayoutMain from '@/components/layout/Main';

export type LayoutRootProps = HTMLAttributes<HTMLDivElement>;

export default function LayoutRoot({
  children,
  className,
  ...props
}: LayoutRootProps) {
  return (
    <Orderbook.Root config={{ symbol: 'BTC/USD', debug: true }}>
      <div className={cn('flex flex-col lg:h-screen', className)} {...props}>
        <LayoutHeader />
        <LayoutMain>{children}</LayoutMain>
        <LayoutFooter />
      </div>
    </Orderbook.Root>
  );
}
