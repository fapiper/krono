'use client';

import {
  formatDigits,
  formatUSD,
  Orderbook,
  OrderbookControls,
  OrderbookTable,
} from '@krono/kit';
import { Card, CardContent } from '@krono/ui/src/components/ui/card';

export function OrderbookCard() {
  return (
    <Card className={'flex flex-1 overflow-hidden'}>
      <CardContent className="flex flex-1 px-0 pb-px pt-2 ">
        <Orderbook.Panel
          renderTable={(props) => (
            <OrderbookTable.Root
              {...props}
              columns={{
                total: {
                  label: 'Total',
                  children: ({ value }) => formatDigits(value.total),
                },
                quantity: {
                  label: 'Quantity',
                  children: ({ value }) => formatDigits(value.quantity),
                },
                price: {
                  label: 'Price',
                  className:
                    props.type === 'bids'
                      ? 'font-semibold text-green-500 dark:text-green-600'
                      : 'font-semibold text-red-500 dark:text-red-600',
                  children: ({ value }) => formatUSD(value.price, 4),
                },
              }}
            />
          )}
        >
          <OrderbookControls.Root>
            <OrderbookControls.LiveBadge />
            <OrderbookControls.Toolbar>
              <OrderbookControls.PlaybackButtons />
              <OrderbookControls.Timeline />
            </OrderbookControls.Toolbar>
          </OrderbookControls.Root>
        </Orderbook.Panel>
      </CardContent>
    </Card>
  );
}
