import type { OrderbookType } from './types';

export const formatUSD = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
};

export const formatDigits = (value: number, digits = 8) => {
  if (value === 0) return '0';
  if (!Number.isFinite(value)) return String(value);

  const rounded = Number(value.toPrecision(digits));
  const integerDigits = Math.floor(Math.abs(rounded)).toString().length;
  const decimalPlaces = Math.max(0, digits - integerDigits);

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
    useGrouping: false,
  }).format(rounded);
};

export const defaultBarColorMap: Record<OrderbookType, string> = {
  bids: 'rgba(34, 197, 94, 0.2)',
  asks: 'rgba(239, 68, 68, 0.2)',
};
