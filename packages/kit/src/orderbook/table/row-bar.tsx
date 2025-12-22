'use client';

import type { OrderbookTableDirection } from '@krono/kit';
import type { CSSProperties } from 'react';

export type OrderbookTableRowBarProps = {
  enabled?: boolean;
  depth?: number;
  color?: string;
  direction?: OrderbookTableDirection;
};

export const getStyles = ({
  enabled = true,
  color,
  depth,
  direction,
}: OrderbookTableRowBarProps = {}): CSSProperties | undefined => {
  if (!enabled) return undefined;

  const styles: CSSProperties & Record<string, string> = {};

  if (color !== undefined) styles['--bar'] = color;
  if (depth !== undefined) styles['--depth'] = String(depth);
  if (direction !== undefined) {
    styles['--origin'] = direction === 'ltr' ? 'left center' : 'right center';
  }

  return Object.keys(styles).length > 0 ? styles : undefined;
};

export const getClassName = ({
  enabled = true,
  color,
  depth,
  direction,
}: OrderbookTableRowBarProps = {}): string | undefined => {
  const hasRequiredValues =
    color !== undefined && depth !== undefined && direction !== undefined;

  if (enabled && hasRequiredValues) {
    return "before:content-[''] before:absolute before:inset-0 before:bg-[var(--bar)] before:scale-x-[var(--depth)] before:origin-left md:before:origin-[var(--origin)] before:pointer-events-none";
  }

  return undefined;
};
