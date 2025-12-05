'use client';

import {
  QueryClient as TanstackQueryClient,
  QueryClientProvider as TanstackQueryClientProvider,
} from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';

const queryClient = new TanstackQueryClient();

export default function QueryClientProvider({ children }: PropsWithChildren) {
  return (
    <>
      <TanstackQueryClientProvider client={queryClient}>
        {' '}
        {children}
      </TanstackQueryClientProvider>
    </>
  );
}
