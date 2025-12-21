'use client';

import { OrderbookSettingsPopover, OrderbookSymbolCombobox } from '@krono/kit';
import { cn } from '@krono/ui/lib';
import Image from 'next/image';
import Link from 'next/link';
import type { HTMLAttributes } from 'react';
import kronoImage from '@/assets/krono.png';

export type LayoutHeaderProps = HTMLAttributes<HTMLDivElement>;

export default function LayoutHeader({
  className,
  children,
  ...props
}: LayoutHeaderProps) {
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
        <OrderbookSymbolCombobox.Root>
          <OrderbookSymbolCombobox.Trigger className={'w-40'} />
          <OrderbookSymbolCombobox.Content />
        </OrderbookSymbolCombobox.Root>
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
        <OrderbookSettingsPopover.Root />
      </div>

      {children}
    </header>
  );
}
