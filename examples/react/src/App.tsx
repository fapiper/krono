import { Orderbook, OrderbookTable } from '@krono/kit';
import { Card, CardContent } from '@krono/ui/components/ui/card.tsx';

function App() {
  return (
    <Orderbook.Root config={{ symbol: 'BTC/USD' }}>
      <div className={'lg:h-screen flex p-4'}>
        <Card className={'flex flex-1'}>
          <CardContent className="flex flex-1 px-0 pb-px pt-2 overflow-hidden">
            <OrderbookTable.Root />
          </CardContent>
        </Card>
      </div>
    </Orderbook.Root>
  );
}

export default App;
