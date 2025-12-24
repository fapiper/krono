import {
  formatDigits,
  formatPrice,
  Orderbook,
  OrderbookControls,
  OrderbookTable,
} from '@krono/kit';
import { Card, CardContent } from '@krono/ui/components/ui/card.tsx';

function App() {
  return (
    <div className={'lg:h-screen flex p-4'}>
      <Card className={'flex shrink grow overflow-hidden'}>
        <CardContent className="flex shrink grow overflow-hidden px-0 pb-px pt-2">
          <Orderbook.Root
            config={{ symbol: 'BTC/USD' }}
            renderTable={(props) => (
              <OrderbookTable.Root
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
                    children: ({ value }) => formatPrice(value.price, 4),
                  },
                }}
                {...props}
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
          </Orderbook.Root>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
