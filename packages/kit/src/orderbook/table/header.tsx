import { cn } from '@krono/ui/lib';
import type { ComponentPropsWithoutRef } from 'react';
import { OrderbookTableCell } from './cell';
import { OrderbookTableRow } from './row';
import type { ColumnDef, OrderbookType } from './types';

export type OrderbookTableHeaderProps = ComponentPropsWithoutRef<'div'> & {
  columns?: ColumnDef[];
  type?: OrderbookType;
  gridCols?: string;
  cellClassName?: string;
};

export function OrderbookTableHeader({
  columns,
  type = 'bids',
  gridCols,
  cellClassName,
  className,
  ...props
}: OrderbookTableHeaderProps) {
  return (
    <OrderbookTableRow
      className={cn(
        'font-bold text-foreground/50 uppercase',
        gridCols,
        className,
      )}
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
          >
            {headerContent}
          </OrderbookTableCell>
        );
      })}
    </OrderbookTableRow>
  );
}
