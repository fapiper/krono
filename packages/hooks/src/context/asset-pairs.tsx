'use client';

import { AssetPairs, type AssetPairsConfig } from '@krono/core';
import type { PropsWithChildren } from 'react';
import { createContext, useContext, useRef } from 'react';

const AssetPairsContext = createContext<AssetPairs | null>(null);

export type AssetPairsProviderProps = PropsWithChildren<{
  config: AssetPairsConfig;
}>;

export function AssetPairsProvider({
  children,
  config,
}: AssetPairsProviderProps) {
  const instanceRef = useRef<AssetPairs | null>(null);

  if (!instanceRef.current) {
    instanceRef.current = new AssetPairs(config);
  }

  return (
    <AssetPairsContext.Provider value={instanceRef.current}>
      {children}
    </AssetPairsContext.Provider>
  );
}

export function useAssetPairsInstance() {
  const ctx = useContext(AssetPairsContext);
  if (!ctx)
    throw new Error(
      'useAssetPairsInstance must be used inside AssetPairsProvider',
    );
  return ctx;
}
