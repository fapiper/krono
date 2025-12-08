'use client';

import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import * as React from 'react';

import { useOrderbookConfig } from '@krono/sdk/react';
import { Button } from '@krono/ui/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@krono/ui/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@krono/ui/components/ui/popover';
import { cn } from '@ui/lib/';

const frameworks = [
  {
    value: 'BTC/USD',
    label: 'BTC/USD',
  },
  {
    value: 'USDG/USD',
    label: 'USDG/USD',
  },
  {
    value: 'BTC/EUR',
    label: 'BTC/EUR',
  },
  {
    value: '1INCH/BTC',
    label: '1INCH/BTC',
  },
  {
    value: 'EUR/USD',
    label: 'EUR/USD',
  },
  {
    value: 'USDT/USD',
    label: 'USDT/USD',
  },
];

export function OrderbookPanelSelect() {
  const [open, setOpen] = React.useState(false);
  const { symbol, setSymbol } = useOrderbookConfig();
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-32 justify-between"
          size={'xs'}
        >
          {symbol
            ? frameworks.find((framework) => framework.value === symbol)?.label
            : 'Select symbol'}
          <ChevronsUpDownIcon className="ml-0.5 h-2 w-2 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        <Command>
          <CommandInput placeholder="Search symbol..." />
          <CommandList>
            <CommandEmpty>No symbol found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setSymbol(currentValue === symbol ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      'mr-0.5 h-2 w-2',
                      symbol === framework.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
