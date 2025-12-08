'use client';

import Moon from '@/components/icons/MoonIcon';
import Sun from '@/components/icons/SunIcon';
import { useTheme } from 'next-app-theme/use-theme';

import { Button } from '@krono/ui/components/ui/button';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button size="icon-xs" variant="outline" onClick={toggleTheme}>
      {theme === 'light' ? (
        <Sun className="h-6 w-6" />
      ) : (
        <Moon className="h-6 w-6" />
      )}
    </Button>
  );
}
