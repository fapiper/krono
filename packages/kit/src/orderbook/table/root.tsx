import { cn } from '@krono/ui/lib';
import { OrderbookTableBody, type OrderbookTableBodyProps } from './body';
import { OrderbookTableColumn, type OrderbookTableColumnProps } from './column';
import { OrderbookTableHeader, type OrderbookTableHeaderProps } from './header';
import type { OrderbookTableRowProps } from './row';
import type { OrderbookTableDirection } from './types';

type BodyPick = 'renderRow' | 'data' | 'columns' | 'type' | 'maxTotal';

export type OrderbookTableRootProps = OrderbookTableColumnProps &
  Pick<OrderbookTableBodyProps, BodyPick> & {
    showHeader?: boolean;
    direction?: OrderbookTableDirection;
    headerProps?: Omit<OrderbookTableHeaderProps, 'children'>;
    bodyProps?: Omit<OrderbookTableBodyProps, BodyPick>;
    rowProps?: Omit<OrderbookTableRowProps, 'children'>;
  };

export function OrderbookTableRoot({
  data,
  columns,
  type = 'bids',
  direction = 'ltr',
  showHeader = true,
  renderRow,
  maxTotal,
  headerProps: _headerProps = {},
  rowProps: _rowProps = {},
  bodyProps,
  className,
  children,
  ...props
}: OrderbookTableRootProps) {
  const defaultBarColor = {
    bids: 'rgba(34, 197, 94, 0.2)',
    asks: 'rgba(239, 68, 68, 0.2)',
  };

  const {
    className: headerClassName,
    columns: headerColumns,
    ...headerProps
  } = _headerProps;

  const {
    barProps: _rowBarProps = {},
    className: rowClassName,
    ...rowProps
  } = _rowProps;
  const { color, ...rowBarProps } = _rowBarProps;
  const rowBarColor = color ?? defaultBarColor[type];

  const orderedColumns = direction === 'ltr' ? columns : [...columns].reverse();

  const gridColsClassName = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[columns.length];

  if (children) {
    return (
      <OrderbookTableColumn className={cn('w-full', className)} {...props}>
        {children}
      </OrderbookTableColumn>
    );
  }

  return (
    <OrderbookTableColumn className={cn('w-full', className)} {...props}>
      {showHeader && (
        <OrderbookTableHeader
          columns={headerColumns ?? orderedColumns}
          type={type}
          className={cn(headerClassName, gridColsClassName)}
          {...headerProps}
        />
      )}
      <OrderbookTableBody
        rowProps={{
          barProps: { color: rowBarColor, direction, ...rowBarProps },
          className: cn(rowClassName, gridColsClassName),
          ...rowProps,
        }}
        data={data}
        columns={columns}
        type={type}
        renderRow={renderRow}
        maxTotal={maxTotal}
        {...bodyProps}
      />
    </OrderbookTableColumn>
  );
}
