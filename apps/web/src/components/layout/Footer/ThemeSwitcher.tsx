'use client';

import { Button } from '@ui/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/components/ui/select';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-app-theme/use-theme';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
  ];

  const currentTheme = themeOptions.find((option) => option.value === theme);
  const IconComponent = currentTheme?.icon || Sun;

  return (
    <Select value={theme} onValueChange={() => toggleTheme()}>
      <SelectTrigger className="w-24 h-7">
        <SelectValue placeholder="Select a theme" />
      </SelectTrigger>
      <SelectContent align="end">
        {themeOptions.map((option) => {
          const Icon = option.icon;
          return (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2 text-sm">
                <Icon className={'w-3 h-3'} />
                <span>{option.label}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
