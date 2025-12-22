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
  ...props
}: OrderbookTableRowBarProps = {}): CSSProperties | undefined => {
  if (!enabled) return {};

  const styles: CSSProperties & Record<string, string> = {};

  if (props.color !== undefined) {
    styles['--bar'] = props.color;
  }

  if (props.depth !== undefined) {
    styles['--depth'] = String(props.depth);
  }

  if (props.direction !== undefined) {
    styles['--origin'] =
      props.direction === 'ltr' ? 'left center' : 'right center';
  }

  return Object.keys(styles).length > 0 ? styles : undefined;
};

export const getClassName = ({
  enabled = true,
}: OrderbookTableRowBarProps = {}): string | false =>
  enabled &&
  "before:content-[''] before:absolute before:inset-0 before:bg-[var(--bar)] before:scale-x-[var(--depth)] before:origin-left md:before:origin-[var(--origin)] before:pointer-events-none";
