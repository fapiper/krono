import dynamic from 'next/dynamic';
const ThemeSwitcher = dynamic(() => import('./ThemeSwitcher'), {
  ssr: false,
  loading: () => <div className="w-6 h-6" />,
});
import MountainIcon from '@/components/icons/MountainIcon';
import { cn } from '@ui/lib';
import type { HTMLAttributes } from 'react';

export type LayoutHeaderProps = HTMLAttributes<HTMLDivElement>;

export default function LayoutHeader({
  className,
  children,
  ...props
}: LayoutHeaderProps) {
  return (
    <header
      className={cn(
        'z-10 sticky top-0 left-0 w-full px-4 lg:px-6 h-12 flex items-center justify-between border-b bg-background',
        className,
      )}
      {...props}
    >
      <div className="flex items-center">
        <MountainIcon className="h-6 w-6" />
        <span className="sr-only">Orderbook Visualizer</span>
      </div>
      <ThemeSwitcher />
      {children}
    </header>
  );
}
