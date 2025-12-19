import type { PriceLevel } from '../types';

/**
 * Maintains price - quantity levels with grouping support.
 */
export class PriceMapManager {
  private map: Map<number, number> = new Map();

  /**
   * Clear all price levels
   */
  clear(): void {
    this.map.clear();
  }

  /**
   * Sets a price level.
   * Deletes the level if quantity is zero.
   */
  set(price: number, volume: number): void {
    if (volume === 0) {
      this.map.delete(price);
    } else {
      this.map.set(price, volume);
    }
  }

  /**
   * Batch update multiple price levels
   */
  batchUpdate(
    levels: Array<{ price: number | string; qty: number | string }>,
  ): void {
    for (const item of levels) {
      const price =
        typeof item.price === 'number'
          ? item.price
          : Number.parseFloat(item.price);
      const qty =
        typeof item.qty === 'number' ? item.qty : Number.parseFloat(item.qty);
      this.set(price, qty);
    }
  }

  /**
   * Returns sorted and optionally grouped levels.
   *
   * @param ascending Sort direction
   * @param limit Max number of rows
   * @param grouping Price step size
   */
  getSorted(
    ascending: boolean,
    limit?: number,
    grouping?: number,
  ): PriceLevel[] {
    let processingMap: Map<number, number>;

    if (grouping && grouping > 0) {
      processingMap = new Map();

      // Determine needed decimals based on grouping (e.g. 0.01 needs 2, 50 needs 0)
      const decimals = this.getPrecision(grouping);

      for (const [price, qty] of this.map.entries()) {
        let rawGrouped: number;

        if (ascending) {
          // Asks: Round UP to next grouping bucket
          rawGrouped = Math.ceil(price / grouping) * grouping;
        } else {
          // Bids: Round DOWN to current grouping bucket
          rawGrouped = Math.floor(price / grouping) * grouping;
        }

        const groupedPrice = Number(rawGrouped.toFixed(decimals));

        const currentQty = processingMap.get(groupedPrice) || 0;
        processingMap.set(groupedPrice, currentQty + qty);
      }
    } else {
      processingMap = this.map;
    }

    const entries = Array.from(processingMap.entries());
    entries.sort((a, b) => (ascending ? a[0] - b[0] : b[0] - a[0]));

    const limited = limit ? entries.slice(0, limit) : entries;

    let cumulativeTotal = 0;
    return limited.map(([price, quantity]) => {
      cumulativeTotal += quantity;
      return {
        price,
        quantity,
        total: cumulativeTotal,
      };
    });
  }

  /**
   * Get the number of price levels
   */
  get size(): number {
    return this.map.size;
  }

  /**
   * Check if empty
   */
  get isEmpty(): boolean {
    return this.map.size === 0;
  }

  /**
   * Helper to count decimal places for toFixed
   */
  private getPrecision(step: number): number {
    if (Math.floor(step) === step) return 0;
    const str = step.toString();
    if (str.includes('e-')) {
      return parseInt(str.split('e-')[1] ?? '0', 10);
    }
    return str.split('.')[1]?.length || 0;
  }
}
