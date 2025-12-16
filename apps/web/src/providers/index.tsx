import type { PropsWithChildren } from 'react';
import { ThemeScriptProvider } from '@/providers/ThemeScript';

export default function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <ThemeScriptProvider />
      {children}
    </>
  );
}
