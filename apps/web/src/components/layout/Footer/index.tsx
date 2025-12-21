'use client';

import { Button } from '@krono/ui/components/ui/button';
import { Separator } from '@krono/ui/components/ui/separator';
import { cn } from '@krono/ui/lib';
import { Github, Globe, Linkedin } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { HTMLAttributes } from 'react';

const ThemeSwitcher = dynamic(() => import('./ThemeSwitcher'), {
  ssr: false,
  loading: () => <div className="w-6 h-6" />,
});

export type LayoutFooterProps = HTMLAttributes<HTMLDivElement>;

export default function LayoutFooter({
  children,
  className,
  ...props
}: LayoutFooterProps) {
  return (
    <footer
      className={cn(
        'shrink-0 flex flex-col md:flex-row items-center w-full bg-background md:h-12 px-4 py-4 gap-2 md:gap-4',
        className,
      )}
      {...props}
    >
      <Link
        className="text-xs text-foreground/60 transition-color ease-in-out duration-200 font-medium hover:text-foreground visited:text-foreground"
        href={
          'https://taikai.network/kraken/hackathons/kraken-forge/projects/cmit01auz00d9jk8jju0g0vtc/idea'
        }
        target={'_blank'}
        rel={'noopener noreferrer'}
      >
        Krono - Orderbook Visualizer
      </Link>

      <Separator orientation="vertical" className={'hidden lg:visible'} />

      <Link
        className="text-xs text-foreground/60 transition-color ease-in-out duration-200 font-medium hover:text-foreground visited:text-foreground"
        href={'https://taikai.network/kraken/hackathons/kraken-forge'}
        target={'_blank'}
        rel={'noopener noreferrer'}
      >
        Kraken Forge
        <span className={'hidden lg:inline'}>
          {' '}
          - Build the tools beneath the surface
        </span>
      </Link>

      <Separator orientation="vertical" className={'hidden lg:visible'} />

      <p className="text-xs">
        Made by{' '}
        <Link
          className="text-xs text-foreground/60 transition-color ease-in-out duration-200 font-medium hover:text-foreground visited:text-foreground"
          href={'https://fabianpiper.com'}
          target={'_blank'}
          rel={'noopener noreferrer'}
        >
          Fabian Piper
        </Link>
      </p>

      <Separator orientation="vertical" className={'hidden lg:visible'} />

      <ThemeSwitcher />

      {children}

      <div className={'flex gap-2 lg:ml-auto'}>
        <Button size={'icon-xs'} variant={'secondary'} asChild={true}>
          <Link
            href={'https://fabianpiper.com'}
            target={'_blank'}
            rel={'noopener noreferrer'}
          >
            <Github />
          </Link>
        </Button>
        <Button size={'icon-xs'} variant={'secondary'}>
          <Linkedin />
        </Button>
        <Button size={'icon-xs'} variant={'secondary'}>
          <Globe />
        </Button>
      </div>
    </footer>
  );
}
