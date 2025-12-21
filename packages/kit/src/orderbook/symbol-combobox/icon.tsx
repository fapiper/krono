'use client';

import { cn } from '@krono/ui/lib';
import { type ComponentPropsWithoutRef, useState } from 'react';

export type OrderbookSymbolComboboxIconProps =
  ComponentPropsWithoutRef<'div'> & {
    src: string;
    alt: string;
  };

export function OrderbookSymbolComboboxIcon({
  src,
  alt,
  className,
  ...props
}: OrderbookSymbolComboboxIconProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-muted text-xs font-semibold',
          className,
        )}
        {...props}
      >
        {alt[0]}
      </div>
    );
  }

  return (
    <div
      className={cn('shrink-0 flex items-center justify-center', className)}
      {...props}
    >
      <img
        src={src}
        alt={alt}
        width={20}
        height={20}
        className="rounded-sm shrink-0"
        onError={() => setError(true)}
      />
    </div>
  );
}
