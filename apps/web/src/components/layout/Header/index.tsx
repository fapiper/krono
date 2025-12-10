'use client';

import dynamic from 'next/dynamic';
const ThemeSwitcher = dynamic(() => import('./ThemeSwitcher'), {
  ssr: false,
  loading: () => <div className="w-6 h-6" />,
});
import MountainIcon from '@/components/icons/MountainIcon';
import { OrderbookPanelSelect } from '@/components/orderbook/Panel/Symbol';
import {
  useOrderbookConfig,
  useOrderbookData,
  useOrderbookStatus,
} from '@krono/sdk/react';
import { Button } from '@ui/components/ui/button';
import { Label } from '@ui/components/ui/label';
import { Switch } from '@ui/components/ui/switch';
import { cn } from '@ui/lib';
import { format } from 'date-fns';
import type { HTMLAttributes } from 'react';

export type LayoutHeaderProps = HTMLAttributes<HTMLDivElement>;

export default function LayoutHeader({
  className,
  children,
  ...props
}: LayoutHeaderProps) {
  const { debug, setDebug } = useOrderbookConfig();
  const status = useOrderbookStatus();
  const { timestamp: currentTimestamp } = useOrderbookData();

  return (
    <header
      className={cn(
        'shrink-0 flex items-center justify-between w-full px-4 h-16 bg-background',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <MountainIcon className="h-6 w-6" />
        <span className="sr-only">Krono</span>
        <OrderbookPanelSelect />
        <div className={'text-xs tabular-nums hidden md:block'}>
          {format(currentTimestamp, 'PPpp')}
        </div>
      </div>
      <div className={'flex justify-end items-center gap-2'}>
        <div className="flex items-center gap-1">
          <Button
            size={'xs'}
            variant={'outline'}
            onClick={() => setDebug(!debug)}
          >
            {debug ? 'Disable Debug' : 'Enable Debug'}
          </Button>
        </div>

        <div className={'flex gap-1'}>
          <ThemeSwitcher />
        </div>
      </div>

      {children}
    </header>
  );
}
