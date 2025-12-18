import type { KrakenAssetPair } from '../types';

export const KRAKEN_API_URL = 'https://api.kraken.com/0/public/AssetPairs';
export const PRIORITY_QUOTES = [
  'USD',
  'USDT',
  'EUR',
  'GBP',
  'USDC',
  'BTC',
  'XBT',
  'ETH',
];

export const ASSET_SYMBOL_MAP: Record<string, string> = {
  XBT: 'BTC',
  XXBT: 'BTC',
  XETH: 'ETH',
  XXRP: 'XRP',
  XLTC: 'LTC',
  XXLM: 'XLM',
  XDAO: 'DAO',
  XETC: 'ETC',
  XICN: 'ICN',
  XMLN: 'MLN',
  XNMC: 'NMC',
  XREP: 'REP',
  XXDG: 'DOGE',
  XXMR: 'XMR',
  XZEC: 'ZEC',
  ZUSD: 'USD',
  ZEUR: 'EUR',
  ZGBP: 'GBP',
  ZCAD: 'CAD',
  ZJPY: 'JPY',
  ZAUD: 'AUD',
  ZKRW: 'KRW',
};

export function getStandardSymbol(krakenAsset: string): string {
  return ASSET_SYMBOL_MAP[krakenAsset] || krakenAsset;
}

export function getCryptoIconUrl(symbol: string): string {
  const standardSymbol = getStandardSymbol(symbol).toLowerCase();
  return `https://assets.kraken.com/marketing/web/icons-uni-webp/s_${standardSymbol}.webp?i=kds`;
}

export function createDisplayLabel(
  baseAsset: string,
  quoteAsset: string,
): string {
  return `${baseAsset}/${quoteAsset}`;
}

export function getLiquidityScore(pair: KrakenAssetPair): number {
  let score = 0;

  const quoteIndex = PRIORITY_QUOTES.indexOf(pair.quote);
  if (quoteIndex !== -1) {
    score += (PRIORITY_QUOTES.length - quoteIndex) * 1000;
  }

  if (pair.ordermin) {
    const orderMin = parseFloat(pair.ordermin);
    if (!Number.isNaN(orderMin) && orderMin > 0) {
      score += 100 / orderMin;
    }
  }

  if (pair.status === 'online') {
    score += 500;
  }

  if (pair.wsname) {
    score += 200;
  }

  return score;
}
