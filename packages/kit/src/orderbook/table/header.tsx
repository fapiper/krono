import { cn } from '@krono/ui/lib';
import { OrderbookTableCell, type OrderbookTableCellProps } from './cell';
import { OrderbookTableRow, type OrderbookTableRowProps } from './row';
import type { ColumnDef, OrderbookType } from './types';

export type OrderbookTableHeaderProps = Omit<
  OrderbookTableRowProps,
  'children'
> & {
  columns?: ColumnDef[];
  type?: OrderbookType;
  cellProps?: Omit<OrderbookTableCellProps, 'children'>;
};

export function OrderbookTableHeader({
  columns,
  type = 'bids',
  cellProps: _cellProps = {},
  className,
  ...props
}: OrderbookTableHeaderProps) {
  const { className: cellClassName, ...cellProps } = _cellProps;
  return (
    <OrderbookTableRow
      className={cn('font-bold text-foreground/50 uppercase', className)}
      barProps={{ enabled: false }}
      {...props}
    >
      {columns?.map((col) => {
        const headerContent =
          typeof col.header === 'function' ? col.header({ type }) : col.header;

        return (
          <OrderbookTableCell
            key={col.id}
            className={cn(col.headerClassName, col.className, cellClassName)}
            {...cellProps}
          >
            {headerContent}
          </OrderbookTableCell>
        );
      })}
    </OrderbookTableRow>
  );
}
