import { type VariantProps, cva } from 'class-variance-authority';
import type React from 'react';

import { cn } from '@ui/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center border rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
      },
      size: {
        default: 'h-10 px-2.5 py-0.5 gap-2 text-xs',
        xs: 'h-7 px-1.5 py-0.5 text-xs gap-1',
        sm: 'h-9 px-2.5 py-0.5 text-xs gap-1.5',
        lg: 'h-11 px-4 py-0.5 text-xs gap-2.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
