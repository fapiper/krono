import {
  type ColumnDef,
  formatDigits,
  formatUSD,
  Orderbook,
  OrderbookControls,
  OrderbookTable,
} from '@krono/kit';
import { Card, CardContent } from '@krono/ui/components/ui/card.tsx';

function App() {
  const columns: ColumnDef[] = [
    {
      id: 'total',
      header: 'Total',
      cell: ({ value }) => formatDigits(value.total),
    },
    {
      id: 'quantity',
      header: 'Quantity',
      cell: ({ value }) => formatDigits(value.quantity),
    },
    {
      id: 'price',
      header: 'Price',
      cell: ({ value }) => formatUSD(value.price),
      cellClassName: ({ type }) =>
        type === 'bids'
          ? 'font-medium text-green-500 dark:text-green-600'
          : 'font-medium text-red-500 dark:text-red-600',
    },
  ];

  return (
    <Orderbook.Root config={{ symbol: 'BTC/USD' }}>
      <div className={'lg:h-screen flex p-4'}>
        <Card className={'flex shrink grow overflow-hidden'}>
          <CardContent className="flex shrink grow overflow-hidden px-0 pb-px pt-2">
            <Orderbook.Panel
              renderTable={(props) => (
                <OrderbookTable.Root columns={columns} {...props} />
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
      </div>
    </Orderbook.Root>
  );
}

export default App;
