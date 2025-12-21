'use client';

import type { PriceLevel } from '@krono/core';
import type { ReactNode } from 'react';
import { OrderbookTableCell } from './cell';
import { OrderbookTableRow, type OrderbookTableRowProps } from './row';
import type {
  OrderbookColumnProps,
  OrderbookTableColumns,
  OrderbookType,
} from './types';

export type OrderbookTableBodyProps = Pick<
  OrderbookTableRowProps,
  'direction'
> & {
  data: PriceLevel[];
  columns?: OrderbookTableColumns;
  type?: OrderbookType;
  maxTotal?: number;
  rowProps?: Omit<OrderbookTableRowProps, 'children' | 'direction'>;
  renderRow?:
    | ((props: OrderbookTableRowProps, index: number) => ReactNode)
    | ReactNode;
};

function renderCell(
  columnProps: OrderbookColumnProps | undefined,
  level: PriceLevel,
  type: OrderbookType,
  index: number,
) {
  const { children, label, ...props } = columnProps || {};

  const content =
    typeof children === 'function'
      ? children({ value: level, type, index })
      : children;

  const finalContent = content ?? (columnProps === undefined ? null : null);

  return <OrderbookTableCell {...props}>{finalContent}</OrderbookTableCell>;
}

export function OrderbookTableBody({
  data,
  columns = {},
  type = 'bids',
  maxTotal,
  renderRow,
  rowProps: _rowProps = {},
  direction,
}: OrderbookTableBodyProps) {
  const maxTotalValue = maxTotal ?? Math.max(...data.map((d) => d.total));
  const { barProps } = _rowProps;

  return (
    <>
      {data.map((level, index) => {
        const depth = maxTotalValue > 0 ? level.total / maxTotalValue : 0;
        const key = `${level.price}-${index}`;

        const children = (
          <>
            {renderCell(columns.total, level, type, index)}
            {renderCell(columns.quantity, level, type, index)}
            {renderCell(columns.price, level, type, index)}
          </>
        );

        const rowProps = {
          ..._rowProps,
          direction,
          barProps: { depth, ...barProps },
          children,
        };

        return renderRow ? (
          typeof renderRow === 'function' ? (
            renderRow({ key, ...rowProps }, index)
          ) : (
            renderRow
          )
        ) : (
          <OrderbookTableRow key={key} {...rowProps} />
        );
      })}
    </>
  );
}
