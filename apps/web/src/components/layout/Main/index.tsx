import { cn } from '@ui/lib';
import type { HTMLAttributes } from 'react';

export type LayoutMainProps = HTMLAttributes<HTMLDivElement>;

export default function LayoutMain({
  children,
  className,
  ...props
}: LayoutMainProps) {
  return (
    <main
      className={cn('flex flex-col shrink grow px-4 pb-4', className)}
      {...props}
    >
      {children}
    </main>
  );
}
