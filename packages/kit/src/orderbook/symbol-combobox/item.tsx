'use client';

import { CommandItem } from '@krono/ui/components/ui/command';
import { cn } from '@krono/ui/lib';
import { CheckIcon } from 'lucide-react';
import { type ComponentPropsWithoutRef, useCallback } from 'react';
import { OrderbookSymbolComboboxIcon } from './icon';
import type { AssetPairOption } from './types';

export type OrderbookSymbolComboboxItemProps = ComponentPropsWithoutRef<
  typeof CommandItem
> & {
  option: AssetPairOption;
  isSelected: boolean;
  onSelect: (value: string) => void;
};

export function OrderbookSymbolComboboxItem({
  option,
  isSelected,
  onSelect,
  className,
  children,
  ...props
}: OrderbookSymbolComboboxItemProps) {
  const handleSelect = useCallback(() => {
    onSelect(option.value);
  }, [option.value, onSelect]);

  return (
    <CommandItem
      value={option.value}
      onSelect={handleSelect}
      className={cn('gap-x-2', className)}
      {...props}
    >
      <CheckIcon
        className={cn('shrink-0', isSelected ? 'opacity-100' : 'opacity-0')}
      />
      <OrderbookSymbolComboboxIcon src={option.icon} alt={option.baseAsset} />
      <span>{children || option.displayLabel}</span>
    </CommandItem>
  );
}
