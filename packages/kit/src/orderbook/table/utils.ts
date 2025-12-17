import { intervalToDuration } from 'date-fns';

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

export const formatDistanceInterval = (
  laterDate: number,
  earlierDate: number,
) => {
  const diffMs = Math.max(0, earlierDate - laterDate);
  const duration = intervalToDuration({ start: 0, end: diffMs });

  const zeroPad = (num?: number) => String(num ?? 0).padStart(2, '0');

  if ((duration.hours ?? 0) > 0) {
    return `${zeroPad(duration.hours)}:${zeroPad(duration.minutes)}:${zeroPad(
      duration.seconds,
    )}`;
  }

  return `${zeroPad(duration.minutes)}:${zeroPad(duration.seconds)}`;
};
