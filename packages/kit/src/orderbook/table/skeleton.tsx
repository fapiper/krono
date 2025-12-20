import { Skeleton } from '@krono/ui/components/ui/skeleton';
import { cn } from '@krono/ui/lib';
import type { ComponentPropsWithoutRef } from 'react';
import {
  OrderbookTable,
  type OrderbookTableCellProps,
  type OrderbookTableRowProps,
} from '../table';

export type OrderbookTableSkeletonProps = ComponentPropsWithoutRef<'div'> & {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  headerRowProps?: Omit<OrderbookTableRowProps, 'children'>;
  bodyRowProps?: Omit<OrderbookTableRowProps, 'children'>;
  cellProps?: OrderbookTableCellProps;
};

export function OrderbookTableSkeleton({
  rows = 15,
  columns = 3,
  showHeader = true,
  headerRowProps: _headerRowProps = {},
  bodyRowProps: _bodyRowProps = {},
  cellProps: _cellProps = {},
  className,
  ...props
}: OrderbookTableSkeletonProps) {
  const gridCols = `grid-cols-${columns}`;
  const rowArray = Array.from({ length: rows }, (_, i) => i);
  const colArray = Array.from({ length: columns }, (_, i) => i);

  const { className: headerRowClassName, ...headerRowProps } = _headerRowProps;
  const { className: bodyRowClassName, ...bodyRowProps } = _bodyRowProps;
  const { className: cellClassName, ...cellProps } = _cellProps;

  return (
    <OrderbookTable.Column
      className={cn('w-full overflow-hidden gap-1 pb-1', className)}
      {...props}
    >
      {showHeader && (
        <OrderbookTable.Row
          className={cn('py-1', gridCols, headerRowClassName)}
          {...headerRowProps}
        >
          {colArray.map((i) => (
            <Skeleton
              key={`header-${i}`}
              className={cn('w-24', cellClassName)}
              {...cellProps}
            />
          ))}
        </OrderbookTable.Row>
      )}

      {rowArray.map((rowIndex) => (
        <OrderbookTable.Row
          key={`row-${rowIndex}`}
          className={cn('gap-1', gridCols, bodyRowClassName)}
          {...bodyRowProps}
        >
          {colArray.map((colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              className={cn('w-full', cellClassName)}
              {...cellProps}
            />
          ))}
        </OrderbookTable.Row>
      ))}
    </OrderbookTable.Column>
  );
}
