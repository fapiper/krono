'use client';

import { CommandItem } from '@krono/ui/components/ui/command';
import { cn } from '@ui/lib';
import { CheckIcon } from 'lucide-react';
import { type ComponentProps, memo, useCallback } from 'react';
import { OrderbookSymbolComboboxIcon } from './icon';
import type { AssetPairOption } from './types';

export type OrderbookSymbolComboboxItemProps = ComponentProps<
  typeof CommandItem
> & {
  option: AssetPairOption;
  isSelected: boolean;
  onSelect: (value: string) => void;
};

export const OrderbookSymbolComboboxItem = memo(function OrderbookSymbolItem({
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
        className={cn(
          'shrink-0 h-4 w-4',
          isSelected ? 'opacity-100' : 'opacity-0',
        )}
      />
      <OrderbookSymbolComboboxIcon src={option.icon} alt={option.baseAsset} />
      <span>{children || option.displayLabel}</span>
    </CommandItem>
  );
});
