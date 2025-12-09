import { Badge } from '@ui/components/ui/badge';
import { Button } from '@ui/components/ui/button';
import { Separator } from '@ui/components/ui/separator';
import { cn } from '@ui/lib';
import { Github, Globe, Linkedin } from 'lucide-react';
import Link from 'next/link';
import type { HTMLAttributes } from 'react';
import { env } from '../../../../env';

export type LayoutFooterProps = HTMLAttributes<HTMLDivElement>;

export default function LayoutFooter({
  children,
  className,
  ...props
}: LayoutFooterProps) {
  return (
    <footer
      className={cn(
        'shrink-0 flex flex-row items-center w-full bg-background border-t lg:h-12 px-4 py-3 gap-4',
        className,
      )}
      {...props}
    >
      <Link
        className="text-xs text-foreground/60 transition-color ease-in-out duration-200 font-medium hover:text-foreground/100 visited:text-foreground/100"
        href={
          'https://taikai.network/kraken/hackathons/kraken-forge/projects/cmit01auz00d9jk8jju0g0vtc/idea'
        }
        target={'_blank'}
        rel={'noopener noreferrer'}
      >
        Krono - Orderbook Visualizer
      </Link>

      <Separator orientation="vertical" />

      <Link
        className="text-xs text-foreground/60 transition-color ease-in-out duration-200 font-medium hover:text-foreground/100 visited:text-foreground/100"
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

      <Separator orientation="vertical" />

      <p className="text-xs">
        Made by{' '}
        <Link
          className="text-foreground/60 transition-color ease-in-out duration-200 font-medium hover:text-foreground/100 visited:text-foreground/100"
          href={'https://fabianpiper.com'}
          target={'_blank'}
          rel={'noopener noreferrer'}
        >
          Fabian Piper
        </Link>
      </p>

      {children}

      <div className={'flex gap-2 items-center justify-center ml-auto'}>
        <Button size={'icon-xs'} variant={'secondary'}>
          <Github />
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
