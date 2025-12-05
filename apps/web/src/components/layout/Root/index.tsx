import LayoutFooter from '@/components/layout/Footer';
import LayoutHeader from '@/components/layout/Header';
import LayoutMain from '@/components/layout/Main';
import { cn } from '@ui/lib';
import type { HTMLAttributes } from 'react';

export type LayoutRootProps = HTMLAttributes<HTMLDivElement>;

export default function LayoutRoot({
  children,
  className,
  ...props
}: LayoutRootProps) {
  return (
    <div
      className={cn('flex flex-col min-h-screen items-stretch', className)}
      {...props}
    >
      <LayoutHeader />
      <LayoutMain>{children}</LayoutMain>
      <LayoutFooter />
    </div>
  );
}
