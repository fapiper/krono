import { cn } from '@ui/lib';
import type { HTMLAttributes } from 'react';

export type LayoutMainProps = HTMLAttributes<HTMLDivElement>;

export default function LayoutMain({
  children,
  className,
  ...props
}: LayoutMainProps) {
  return (
    <main className={cn('flex flex-1 items-stretch', className)} {...props}>
      {children}
    </main>
  );
}
