import { Orderbook, OrderbookTable } from '@krono/kit';
import { Card, CardContent } from '@krono/ui/components/ui/card.tsx';

function App() {
  return (
    <Orderbook.Root config={{ symbol: 'BTC/USD' }}>
      <Card className={'relative flex flex-1 flex-col group'}>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 pb-px pt-2 text-xs gap-0.5 flex-1">
          <OrderbookTable.Root />
        </CardContent>
      </Card>
    </Orderbook.Root>
  );
}

export default App;
