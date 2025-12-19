'use client';

import { cn } from '@krono/ui/lib';
import type { OrderbookTableBaseProps, PriceLevelDataProps } from './types';
import { formatDigits, formatUSD } from './utils';

export function OrderbookTableHeader({
  type = 'bids',
}: Pick<PriceLevelDataProps, 'type'>) {
  const isBids = type === 'bids';
  const isRTL = isBids;
  const labels = ['Total', 'Quantity', 'Price'];

  return (
    <div className="grid grid-cols-3 grow shrink-0 px-2 py-0.5">
      {(isRTL ? labels : [...labels].reverse()).map((label) => (
        <span
          className="block font-semibold tabular-nums text-foreground/50 uppercase"
          key={label}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

export type OrderbookTableRowProps = PriceLevelDataProps &
  OrderbookTableBaseProps;

export function OrderbookTableRow({
  data,
  maxTotal,
  type = 'bids',
  className,
  ...props
}: OrderbookTableRowProps) {
  const isBids = type === 'bids';
  const isRTL = isBids;
  const barColor = isBids ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)';

  return (
    <div
      className={cn('w-full flex flex-col grow shrink-0', className)}
      {...props}
    >
      <OrderbookTableHeader type={type} />

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
              "grid grid-cols-3 grow shrink-0 px-2 py-0.5 relative w-full items-center before:content-[''] before:absolute before:inset-y-px before:left-0 before:right-0 before:bg-[var(--bar)] before:scale-x-[var(--depth)] before:origin-[var(--origin)] before:pointer-events-none"
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
