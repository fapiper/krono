import type { OrderbookType } from './types';

export const formatUSD = (value: number, decimals = 2) => {
  if (!Number.isFinite(value)) return String(value);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatDigits = (
  value: number,
  opts: {
    decimals?: number; // How many decimal places to show (default: 8)
    minVal?: number; // Threshold to show "< 0.00..." instead of "0.00..."
    useGrouping?: boolean;
  } = {},
) => {
  const { decimals = 8, minVal = 1e-8, useGrouping = true } = opts;

  if (!Number.isFinite(value)) return String(value);

  if (value === 0) {
    return `0.${'0'.repeat(decimals)}`;
  }

  const absVal = Math.abs(value);

  if (absVal > 0 && absVal < minVal) {
    return `< ${minVal.toFixed(decimals)}`;
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping,
  }).format(value);
};

export const defaultBarColorMap: Record<OrderbookType, string> = {
  bids: 'rgba(34, 197, 94, 0.2)',
  asks: 'rgba(239, 68, 68, 0.2)',
};
