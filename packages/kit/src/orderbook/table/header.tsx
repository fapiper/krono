import { cn } from '@krono/ui/lib';
import { OrderbookTableCell } from './cell';
import { OrderbookTableRow, type OrderbookTableRowProps } from './row';
import type { OrderbookTableColumns, OrderbookType } from './types';

export type OrderbookTableHeaderProps = Omit<
  OrderbookTableRowProps,
  'children'
> & {
  columns?: OrderbookTableColumns;
  type?: OrderbookType;
};

export function OrderbookTableHeader({
  columns = {},
  type = 'bids',
  className,
  ...props
}: OrderbookTableHeaderProps) {
  const renderHeaderCell = (column?: { label?: React.ReactNode }) => (
    <OrderbookTableCell>{column?.label}</OrderbookTableCell>
  );

  return (
    <OrderbookTableRow
      className={cn('font-bold text-foreground uppercase', className)}
      barProps={{ enabled: false }}
      {...props}
    >
      {renderHeaderCell(columns.total)}
      {renderHeaderCell(columns.quantity)}
      {renderHeaderCell(columns.price)}
    </OrderbookTableRow>
  );
}
