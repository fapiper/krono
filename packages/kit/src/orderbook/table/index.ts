import { OrderbookTableBody } from './body';
import { OrderbookTableCell } from './cell';
import { OrderbookTableColumn } from './column';
import { OrderbookTableHeader } from './header';
import { OrderbookTableRoot } from './root';
import { OrderbookTableRow } from './row';
import {
  getClassName as getRowBarClassName,
  getStyles as getRowBarStyles,
} from './row-bar';
import { OrderbookTableSkeleton } from './skeleton';

export type { OrderbookTableCellProps } from './cell';
export type { OrderbookTableColumnProps } from './column';
export type { OrderbookTableRootProps } from './root';
export type { OrderbookTableRowProps } from './row';
export type { OrderbookTableRowBarProps } from './row-bar';
export type { OrderbookTableSkeletonProps } from './skeleton';

export * from './types';
export * from './utils';

export { getRowBarClassName, getRowBarStyles };

export const OrderbookTable = {
  Root: OrderbookTableRoot,
  Header: OrderbookTableHeader,
  Body: OrderbookTableBody,
  Row: OrderbookTableRow,
  Cell: OrderbookTableCell,
  Column: OrderbookTableColumn,
  Skeleton: OrderbookTableSkeleton,
};
