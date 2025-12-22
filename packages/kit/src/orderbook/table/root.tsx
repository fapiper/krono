import { defaultBarColorMap } from '@krono/kit';
import { cn } from '@krono/ui/lib';
import { OrderbookTableBody, type OrderbookTableBodyProps } from './body';
import { OrderbookTableColumn, type OrderbookTableColumnProps } from './column';
import { OrderbookTableHeader, type OrderbookTableHeaderProps } from './header';
import type { OrderbookTableRowProps } from './row';
import type { OrderbookTableColumns } from './types';

type HeaderPick = 'type' | 'direction' | 'columns';
type BodyPick = HeaderPick | 'renderRow' | 'data' | 'maxTotal';

export type OrderbookTableRootProps = OrderbookTableColumnProps &
  Pick<OrderbookTableBodyProps, BodyPick> & {
    columns?: OrderbookTableColumns;
    showHeader?: boolean;
    headerProps?: Omit<OrderbookTableHeaderProps, HeaderPick>;
    bodyProps?: Omit<OrderbookTableBodyProps, BodyPick>;
    rowProps?: Omit<OrderbookTableRowProps, 'children'>;
  };

export function OrderbookTableRoot({
  data,
  columns = {},
  type = 'bids',
  direction = 'ltr',
  showHeader = true,
  renderRow,
  maxTotal,
  headerProps,
  rowProps: _rowProps = {},
  bodyProps,
  className,
  children,
  ...props
}: OrderbookTableRootProps) {
  const { barProps: _rowBarProps = {}, ...rowProps } = _rowProps;
  const { color, ...rowBarProps } = _rowBarProps;
  const rowBarColor = color ?? defaultBarColorMap[type];

  if (children) {
    return (
      <OrderbookTableColumn className={cn(className)} {...props}>
        {children}
      </OrderbookTableColumn>
    );
  }

  return (
    <OrderbookTableColumn
      className={cn(
        'krono-orderbook-table',
        direction === 'ltr' ? 'md:text-left' : 'md:text-right',
        className,
      )}
      {...props}
    >
      {showHeader && (
        <OrderbookTableHeader
          columns={columns}
          type={type}
          direction={direction}
          {...headerProps}
        />
      )}
      <OrderbookTableBody
        rowProps={{
          barProps: { color: rowBarColor, direction, ...rowBarProps },
          ...rowProps,
        }}
        data={data}
        columns={columns}
        type={type}
        renderRow={renderRow}
        maxTotal={maxTotal}
        direction={direction}
        {...bodyProps}
      />
    </OrderbookTableColumn>
  );
}
