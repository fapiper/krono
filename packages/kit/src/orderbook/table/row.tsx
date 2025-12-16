'use client';

import type { PriceLevel } from '@krono/core';
import { cn } from '@ui/lib';

const formatUSD = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
};

const formatDigits = (value: number, digits = 8) => {
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

export function OrderbookTableRow({
  data,
  maxTotal,
  type = 'bids',
}: {
  data: PriceLevel[];
  maxTotal: number;
  type?: 'bids' | 'asks';
}) {
  const isBids = type === 'bids';
  const isRTL = isBids;
  const barColor = isBids ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)';

  const labels = ['Total', 'Quantity', 'Price'];

  return (
    <div className={'w-full flex flex-col grow shrink-0'}>
      <div className="grid grid-cols-3 grow shrink-0 px-2 py-0">
        {(isRTL ? labels : [...labels].reverse()).map((label) => (
          <span
            className="block font-semibold tabular-nums text-foreground/50 uppercase"
            key={label}
          >
            {label}
          </span>
        ))}
      </div>

      {data.map((level, index) => {
        const depth = maxTotal > 0 ? level.total / maxTotal : 0;

        const items = [
          formatDigits(level.total),
          formatDigits(level.quantity),
          formatUSD(level.price),
        ];

        return (
          <div
            key={`${level.price}-${index}`}
            style={{
              ['--bar' as string]: barColor,
              ['--depth' as string]: String(depth),
              ['--origin' as string]: isRTL ? 'right center' : 'left center',
            }}
            className={
              "grid grid-cols-3 grow shrink-0 px-2 py-0 relative w-full items-center before:content-[''] before:absolute before:inset-y-px before:left-0 before:right-0 before:bg-(--bar) before:scale-x-(--depth) before:origin-(--origin) before:pointer-events-none"
            }
          >
            {(isRTL ? items : [...items].reverse()).map((item, i) => (
              <span
                className={cn(
                  'block relative tabular-nums',
                  i === (isRTL ? items.length - 1 : 0) &&
                    (isBids
                      ? 'font-medium text-green-500 dark:text-green-600'
                      : 'font-medium text-red-500 dark:text-red-600'),
                )}
                key={`${level.price}-${i}-${item}`}
              >
                {item}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}
