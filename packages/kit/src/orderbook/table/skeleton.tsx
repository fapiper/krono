import { Skeleton } from '@krono/ui/components/ui/skeleton';
import { cn } from '@krono/ui/lib';
import type { ComponentPropsWithoutRef } from 'react';
import {
  gridColsClassNameMap,
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
  const rowArray = Array.from({ length: rows }, (_, i) => i);
  const colArray = Array.from({ length: columns }, (_, i) => i);
  const gridColsClassName = gridColsClassNameMap[columns];

  const { className: headerRowClassName, ...headerRowProps } = _headerRowProps;
  const { className: bodyRowClassName, ...bodyRowProps } = _bodyRowProps;
  const { className: cellClassName, ...cellProps } = _cellProps;

  return (
    <OrderbookTable.Column className={cn('', className)} {...props}>
      {showHeader && (
        <OrderbookTable.Row
          className={cn(
            'gap-0 items-stretch',
            gridColsClassName,
            headerRowClassName,
          )}
          {...headerRowProps}
        >
          {colArray.map((i) => (
            <Skeleton
              key={`header-${i}`}
              className={cn('w-24 shrink-0 grow', cellClassName)}
              {...cellProps}
            />
          ))}
        </OrderbookTable.Row>
      )}

      {rowArray.map((rowIndex) => (
        <OrderbookTable.Row
          key={`row-${rowIndex}`}
          className={cn(
            'gap-0.5 items-stretch',
            gridColsClassName,
            bodyRowClassName,
          )}
          {...bodyRowProps}
        >
          {colArray.map((colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              className={cn('w-full shrink-0 grow', cellClassName)}
              {...cellProps}
            />
          ))}
        </OrderbookTable.Row>
      ))}
    </OrderbookTable.Column>
  );
}
