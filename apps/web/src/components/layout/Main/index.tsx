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
      className={cn(
        'flex shrink grow items-stretch overflow-hidden',
        className,
      )}
      {...props}
    >
      {children}
    </main>
  );
}
