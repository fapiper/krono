'use client';

import { useOrderbookConfig, useOrderbookStatus } from '@krono/hooks';
import { Button } from '@ui/components/ui/button';
import { Input } from '@ui/components/ui/input';
import { Label } from '@ui/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@ui/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/components/ui/select';
import { Separator } from '@ui/components/ui/separator';
import { Switch } from '@ui/components/ui/switch';
import { Check, Settings } from 'lucide-react';
import { useState } from 'react';

export function OrderbookSettingsPopoverRoot() {
  const {
    debug,
    setDebug,
    historyEnabled,
    setHistoryEnabled,
    depth,
    setDepth,
    maxHistoryLength,
    setMaxHistoryLength,
    throttleMs,
    setThrottle,
    debounceMs,
    setDebounce,
  } = useOrderbookConfig();
  const status = useOrderbookStatus();

  const [maxHistory, setMaxHistory] = useState(String(maxHistoryLength));
  const [selectedDepth, setSelectedDepth] = useState(String(depth));
  const [throttleValue, setThrottleValue] = useState(String(throttleMs ?? ''));
  const [debounceValue, setDebounceValue] = useState(String(debounceMs ?? ''));

  const toggleSettings = [
    {
      id: 'debug',
      label: 'Debug Mode',
      description: 'Enable logging and debug information',
      checked: debug,
      onCheckedChange: setDebug,
    },
    {
      id: 'history',
      label: 'Store History',
      description: 'Keep a history buffer of orderbook updates',
      checked: historyEnabled,
      onCheckedChange: setHistoryEnabled,
    },
  ];

  const numericSettings = [
    {
      id: 'maxHistory',
      label: 'Max History Size',
      description: 'Maximum number of entries in the history buffer',
      value: maxHistory,
      min: 1,
      onChange: setMaxHistory,
      onApply: () => {
        setMaxHistoryLength(Number(maxHistory));
      },
      disabled: (value: string) => Number(value) < 1,
    },
    {
      id: 'throttle',
      label: 'Throttle (ms)',
      description: 'Limit update frequency to improve performance',
      value: throttleValue,
      min: 0,
      onChange: setThrottleValue,
      onApply: () => {
        const value = Number(throttleValue);
        setThrottle(value > 0 ? value : undefined);
      },
      disabled: (value: string) => value !== '' && Number(value) < 0,
    },
    {
      id: 'debounce',
      label: 'Debounce (ms)',
      description: 'Delay updates until input stabilizes',
      value: debounceValue,
      min: 0,
      onChange: setDebounceValue,
      onApply: () => {
        const value = Number(debounceValue);
        setDebounce(value > 0 ? value : undefined);
      },
      disabled: (value: string) => value !== '' && Number(value) < 0,
    },
  ];

  const depthOptions = ['10', '25', '100', '500', '1000'];

  return (
    <Popover>
      <PopoverTrigger asChild={true}>
        <Button size="sm" variant="outline">
          <Settings />
          Settings
        </Button>
      </PopoverTrigger>
      <PopoverContent side={'left'} className="w-[26rem]">
        <div className="grid gap-4">
          <div>
            <h3 className="font-semibold text-base mb-1">Settings</h3>
            <p className="text-muted-foreground text-sm">
              Configure orderbook behavior and display options
            </p>
          </div>

          <Separator orientation={'horizontal'} />

          {toggleSettings.map((setting) => (
            <div key={setting.id} className="flex items-start justify-between">
              <div className="">
                <Label htmlFor={setting.id} className="text-xs font-semibold">
                  {setting.label}
                </Label>
                <p className="text-muted-foreground text-xs">
                  {setting.description}
                </p>
              </div>
              <div className="mt-2">
                <Switch
                  id={setting.id}
                  checked={setting.checked}
                  onCheckedChange={setting.onCheckedChange}
                />
              </div>
            </div>
          ))}

          <Separator orientation={'horizontal'} />

          <div className="flex gap-4 justify-between items-end">
            <div>
              <Label htmlFor="depth" className="text-xs font-semibold">
                Orderbook Depth
              </Label>
              <p className="text-muted-foreground text-xs">
                Number of price levels to request
              </p>
            </div>
            <div className="flex gap-2">
              <Select value={selectedDepth} onValueChange={setSelectedDepth}>
                <SelectTrigger id="depth" className="flex-1 h-9 w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={'w-32'}>
                  {depthOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                onClick={() =>
                  setDepth(Number(selectedDepth) as 1000 | 100 | 10 | 25 | 500)
                }
              >
                Apply
              </Button>
            </div>
          </div>

          {numericSettings.map(
            ({
              id,
              label,
              description,
              value,
              onApply,
              onChange,
              disabled,
              ...props
            }) => (
              <div key={id} className="flex gap-4 justify-between items-end">
                <div>
                  <Label htmlFor={id} className="text-xs font-semibold">
                    {label}
                  </Label>
                  <p className="text-muted-foreground text-xs">{description}</p>
                </div>
                <div className="flex gap-2">
                  <Input
                    id={id}
                    type="number"
                    value={value}
                    className="flex-1 h-9 w-24"
                    onChange={(e) => onChange(e.target.value)}
                    {...props}
                  />
                  <Button
                    size="sm"
                    variant="default"
                    onClick={onApply}
                    disabled={disabled?.(value)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            ),
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
