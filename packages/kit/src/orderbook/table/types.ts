import type { PriceLevel } from '@krono/core';
import type { ReactNode } from 'react';

export type OrderbookType = 'bids' | 'asks';

export type OrderbookTableDirection = 'ltr' | 'rtl';

export type ColumnDef<TData = PriceLevel> = {
  id: string;
  header: ReactNode | ((props: { type: OrderbookType }) => ReactNode);
  cell: (props: {
    value: TData;
    type: OrderbookType;
    index: number;
  }) => ReactNode;
  accessorKey?: keyof TData;
  className?: string;
  headerClassName?: string;
  cellClassName?:
    | string
    | ((props: { type: OrderbookType; index: number }) => string);
};
