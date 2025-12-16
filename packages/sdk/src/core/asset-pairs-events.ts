import type {
  AssetPairsConfig,
  AssetPairsData,
  AssetPairsStatus,
} from './types';

export const AssetPairsEventKey = {
  StatusUpdate: 'update:status',
  DataUpdate: 'update:data',
  ConfigUpdate: 'update:config',
  Error: 'error',
} as const;

export type AssetPairsEventKey =
  (typeof AssetPairsEventKey)[keyof typeof AssetPairsEventKey];

export type AssetPairsEventMap = {
  [AssetPairsEventKey.StatusUpdate]: AssetPairsStatus;
  [AssetPairsEventKey.DataUpdate]: AssetPairsData;
  [AssetPairsEventKey.ConfigUpdate]: AssetPairsConfig;
  [AssetPairsEventKey.Error]: Error;
};
