'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@ui/lib/utils';
import * as React from 'react';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center group/slider-root',
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden bg-black/15 dark:bg-white/15 group-hover/slider-root:h-1.5 transition-all duration-200">
      <SliderPrimitive.Range className="absolute bottom-0 h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        'transition-transform duration-300 ease-out',
        'block h-3 w-3 scale-100 group-hover/slider-root:scale-125 transition-all duration-200 rounded-full border-1 border-white shadow-sm bg-black dark:bg-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      )}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
