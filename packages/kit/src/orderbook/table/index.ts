import { OrderbookTableChart } from './chart';
import { OrderbookTableRoot } from './root';
import { OrderbookTableRow } from './row';
import { OrderbookTableSkeleton } from './skeleton';

export type { OrderbookTableChartProps } from './chart';
export type { OrderbookTableRootProps } from './root';
export type { OrderbookTableRowProps } from './row';
export type { OrderbookTableSkeletonProps } from './skeleton';

export * from './types';

export const OrderbookTable = {
  Root: OrderbookTableRoot,
  Chart: OrderbookTableChart,
  Row: OrderbookTableRow,
  Skeleton: OrderbookTableSkeleton,
};
