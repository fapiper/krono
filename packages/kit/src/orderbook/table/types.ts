import type { PriceLevel } from '@krono/core';
import type { ReactNode } from 'react';
import type { OrderbookTableCellProps } from './cell';

export type OrderbookType = 'bids' | 'asks';
export type OrderbookTableDirection = 'ltr' | 'rtl';

export type OrderbookColumnRenderContext = {
  value: PriceLevel;
  type: OrderbookType;
  index: number;
};

export type OrderbookColumnProps = Omit<OrderbookTableCellProps, 'children'> & {
  label?: ReactNode;
  children?: ReactNode | ((context: OrderbookColumnRenderContext) => ReactNode);
};

export type OrderbookTableColumns = {
  price?: OrderbookColumnProps;
  quantity?: OrderbookColumnProps;
  total?: OrderbookColumnProps;
};
