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
  ...props
}: OrderbookTableRowBarProps = {}): CSSProperties => {
  if (!enabled) return {};

  return {
    ['--bar' as string]: props.color,
    ['--depth' as string]: String(props.depth),
    ['--origin' as string]:
      props.direction === 'ltr' ? 'left center' : 'right center',
  };
};

export const getClassName = ({
  enabled = true,
}: OrderbookTableRowBarProps = {}): string | false =>
  enabled &&
  "before:content-[''] before:absolute before:inset-y-px before:left-0 before:right-0 before:bg-[var(--bar)] before:scale-x-[var(--depth)] before:origin-[var(--origin)] before:pointer-events-none";
