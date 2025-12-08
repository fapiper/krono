'use client';

import { OrderbookPanelRow } from '@/components/orderbook/Panel/Row';
import { OrderbookPanelSelect } from '@/components/orderbook/Panel/Symbol';
import { useOrderbook } from '@krono/sdk/react';
import { Button } from '@krono/ui/components/ui/button';
import { ButtonGroup } from '@krono/ui/components/ui/button-group';
import { Separator } from '@krono/ui/components/ui/separator';
import { ScrollArea } from '@ui/components/ui/scroll-area';
import { Slider } from '@ui/components/ui/slider';

const formatUSD = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
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

export function OrderbookPanel() {
  const { debug, setDebug, bids, asks, history: data } = useOrderbook();

  return (
    <ScrollArea
      className="flex flex-col grow-1 shrink-1 w-full"
      type={'always'}
    >
      <div className="flex items-center justify-between gap-4 lg:gap-6 px-4 lg:px-6">
        <div>
          <OrderbookPanelSelect />
        </div>
        <div className={'flex justify-end items-center gap-4 lg:gap-6 py-2'}>
          <span className="text-sm">Live</span>

          <div className={'flex gap-1'}>
            <Button
              size="xs"
              variant="outline"
              onClick={() => setDebug(!debug)}
            >
              {debug ? 'Disable debug' : 'Enable debug'}
            </Button>

            <Button
              size="xs"
              variant="outline"
              onClick={data.prev}
              disabled={!data.prev}
            >
              Back
            </Button>

            <Button
              size="xs"
              variant="outline"
              onClick={data.next}
              disabled={!data.next}
            >
              Forward
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 p-4 lg:p-6 text-sm gap-6">
        <div className={'text-right'}>
          <OrderbookPanelRow
            className={
              'text-xs font-semibold uppercase tracking-wider text-foreground/50'
            }
            cells={['Total', 'Quantity', 'Price']}
          />
          {data.current?.bids.map((bid) => (
            <OrderbookPanelRow
              className={'font-mono'}
              key={`${bid.total}-${bid.quantity}-${bid.price}`}
              cells={[
                formatDigits(bid.total),
                formatDigits(bid.quantity),
                formatUSD(bid.price),
              ]}
            />
          ))}
        </div>
        <div className={'text-left'}>
          <OrderbookPanelRow
            className={
              'text-xs font-semibold uppercase tracking-wider text-foreground/50'
            }
            cells={['Price', 'Quantity', 'Total']}
          />
          {data.current?.asks.map((ask) => (
            <OrderbookPanelRow
              className={'font-mono'}
              key={`${ask.price}-${ask.quantity}-${ask.total}`}
              cells={[
                formatUSD(ask.price),
                formatDigits(ask.quantity),
                formatDigits(ask.total),
              ]}
            />
          ))}
        </div>
      </div>

      <div className={'sticky bottom-0 left-0 w-full p-2'}>
        <div
          className={
            'w-full max-w-2xl mx-auto p-0.5 lg:p-4 bg-black/50 rounded-lg'
          }
        >
          <Slider
            step={1}
            min={0}
            max={1000}
            value={[data.index]}
            onValueChange={(values) => data.select(values[0] ?? 0)}
          />
        </div>
      </div>
    </ScrollArea>
  );
}
