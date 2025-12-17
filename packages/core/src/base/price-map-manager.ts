import type { PriceLevel } from '../types';

/**
 * Manages a price-level map with efficient updates
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
   * Set a price level (or remove if volume is 0)
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
   * Get sorted price levels with optional grouping
   * @param ascending - Sort direction
   * @param limit - Max rows
   * @param grouping - The step size (e.g., 0.1, 0.5, 1.0). If 0 or null, no grouping.
   */
  getSorted(
    ascending: boolean,
    limit?: number,
    grouping?: number,
  ): PriceLevel[] {
    let processingMap: Map<number, number>;

    if (grouping && grouping > 0) {
      processingMap = new Map();

      for (const [price, qty] of this.map.entries()) {
        let groupedPrice: number;

        if (ascending) {
          groupedPrice = Math.ceil(price / grouping) * grouping;
        } else {
          groupedPrice = Math.floor(price / grouping) * grouping;
        }

        groupedPrice = Number(groupedPrice.toFixed(8)); // Oder toFixed(2) je nach Asset

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
}
