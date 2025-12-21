import type { HTMLAttributes, ReactNode } from 'react';

export type OrderbookSettingsBaseProps = HTMLAttributes<HTMLDivElement>;

export type OrderbookSettingsRowBaseProps = OrderbookSettingsBaseProps & {
  label: string;
  description?: string;
  control?: ReactNode;
};
