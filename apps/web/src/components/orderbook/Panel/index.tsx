'use client';

import { OrderbookTable } from '@krono/kit';
import { Card, CardContent } from '@krono/ui/components/ui/card';

export function OrderbookPanel() {
  return (
    <Card className={'flex flex-1'}>
      <CardContent className="flex flex-1 px-0 pb-px pt-2 overflow-hidden">
        <OrderbookTable.Root />
      </CardContent>
    </Card>
  );
}
