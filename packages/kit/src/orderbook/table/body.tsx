'use client';

import type { PriceLevel } from '@krono/core';
import { cn } from '@krono/ui/lib';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { OrderbookTableCell, type OrderbookTableCellProps } from './cell';
import { OrderbookTableRow, type OrderbookTableRowProps } from './row';
import type { ColumnDef, OrderbookType } from './types';

export type OrderbookTableBodyProps = ComponentPropsWithoutRef<'div'> & {
  data: PriceLevel[];
  columns: ColumnDef[];
  type?: OrderbookType;
  maxTotal?: number;
  rowProps?: Omit<OrderbookTableRowProps, 'children'>;
  cellProps?: Omit<OrderbookTableCellProps, 'children'>;
  renderRow?:
    | ((props: OrderbookTableRowProps, index: number) => ReactNode)
    | ReactNode;
};

export function OrderbookTableBody({
  data,
  columns,
  type = 'bids',
  maxTotal,
  renderRow,
  className,
  rowProps: _rowProps = {},
  cellProps: _cellProps = {},
  ...props
}: OrderbookTableBodyProps) {
  const maxTotalValue = maxTotal ?? Math.max(...data.map((d) => d.total));
  const { barProps } = _rowProps;
  const { className: cellClassName, ...cellProps } = _cellProps;

  return (
    <div className={cn('flex flex-col', className)} {...props}>
      {data.map((level, index) => {
        const depth = maxTotalValue > 0 ? level.total / maxTotalValue : 0;
        const key = `${level.price}-${index}`;
        const children = (
          <>
            {columns.map((column, colIndex) => {
              const cellContent = column.cell({ value: level, type, index });
              const computedCellClassName =
                typeof column.cellClassName === 'function'
                  ? column.cellClassName({ type, index: colIndex })
                  : column.cellClassName;

              return (
                <OrderbookTableCell
                  key={`${column.id}-${index}`}
                  className={cn(
                    column.className,
                    computedCellClassName,
                    cellClassName,
                  )}
                  {...cellProps}
                >
                  {cellContent}
                </OrderbookTableCell>
              );
            })}
          </>
        );

        const rowProps = {
          ..._rowProps,
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
    </div>
  );
}
