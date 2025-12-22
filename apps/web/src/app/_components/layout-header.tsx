'use client';

import { OrderbookSymbolCombobox } from '@krono/kit';
import { Button } from '@krono/ui/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@krono/ui/components/ui/sheet';
import { cn } from '@krono/ui/src/lib';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import type { HTMLAttributes } from 'react';
import LayoutHeaderContent from '@/app/_components/layout-header-content';
import kronoImage from '@/assets/krono.png';

export type LayoutHeaderProps = HTMLAttributes<HTMLDivElement>;

export default function LayoutHeader({
  className,
  children,
  ...props
}: LayoutHeaderProps) {
  return (
    <Sheet>
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
          <SheetTrigger asChild={true}>
            <Button
              size={'icon-sm'}
              variant={'outline'}
              className={'md:hidden'}
            >
              <Menu />
            </Button>
          </SheetTrigger>

          <LayoutHeaderContent
            className={
              'hidden md:flex flex-row justify-end items-center gap-x-6 text-sm'
            }
          />
        </div>

        {children}
      </header>

      <SheetContent>
        <LayoutHeaderContent
          className={'flex py-14 px-4 flex-1 flex-col text-lg gap-y-4'}
          settingsTriggerProps={{
            children: (
              <Button size={'lg'} variant={'secondary'} className={'mt-auto'}>
                Orderbook Settings
              </Button>
            ),
            asChild: true,
          }}
        />
      </SheetContent>
    </Sheet>
  );
}
