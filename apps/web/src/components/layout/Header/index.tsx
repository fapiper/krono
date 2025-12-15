'use client';

import { useOrderbookData } from '@krono/sdk/react';
import { cn } from '@ui/lib';
import Image from 'next/image';
import Link from 'next/link';
import type { HTMLAttributes } from 'react';
import kronoImage from '@/assets/krono.png';
import MountainIcon from '@/components/icons/MountainIcon';
import LayoutHeaderSettingsPopover from '@/components/layout/Header/SettingsPopover';
import { OrderbookPanelSelect } from '@/components/orderbook/Panel/Symbol';

export type LayoutHeaderProps = HTMLAttributes<HTMLDivElement>;

export default function LayoutHeader({
  className,
  children,
  ...props
}: LayoutHeaderProps) {
  const { timestamp: currentTimestamp } = useOrderbookData();

  return (
    <header
      className={cn(
        'shrink-0 flex items-center justify-between w-full px-4 h-16 bg-background',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-4">
        <Image
          src={kronoImage}
          alt={'Krono'}
          className="w-8 h-8 rounded-lg"
          width={40}
          height={40}
        />
        <span className="sr-only">Krono</span>
        <OrderbookPanelSelect />
        {/*
        <div className={'text-xs tabular-nums hidden md:block'}>
          {format(currentTimestamp, 'PPpp')}
        </div>
*/}
      </div>
      <div className={'flex justify-end items-center gap-6'}>
        <Link
          href={'/about'}
          className={
            'text-sm text-foreground/60 transition-color ease-in-out duration-200 font-medium hover:text-foreground visited:text-foreground'
          }
        >
          About
        </Link>
        <Link
          href={'/docs'}
          className={
            'text-sm text-foreground/60 transition-color ease-in-out duration-200 font-medium hover:text-foreground visited:text-foreground'
          }
        >
          Documentation
        </Link>
        <LayoutHeaderSettingsPopover />
      </div>

      {children}
    </header>
  );
}
