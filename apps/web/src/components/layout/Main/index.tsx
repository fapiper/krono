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
      className={cn('flex-1 flex items-center justify-center', className)}
      {...props}
    >
      {children}
    </main>
  );
}
