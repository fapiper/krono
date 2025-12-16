'use client';

import { OrderbookTable } from '@krono/kit';
import { Card, CardContent } from '@ui/components/ui/card';

export function OrderbookPanel() {
  return (
    <Card className={'relative flex flex-1 flex-col group'}>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 pb-px pt-2 text-xs gap-0.5 flex-1">
        <OrderbookTable.Root />
      </CardContent>
    </Card>
  );
}
