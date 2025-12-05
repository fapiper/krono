import { cn } from '@ui/lib';
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
        'flex items-center justify-center h-16 px-4 lg:px-6 border-t',
        className,
      )}
      {...props}
    >
      <p className="text-sm">Environment: {env.NODE_ENV}</p>
      {children}
    </footer>
  );
}
