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
   * Get sorted price levels
   * @param ascending - Sort direction (true = ascending for asks, false = descending for bids)
   * @param limit - Maximum number of levels to return
   */
  getSorted(ascending: boolean, limit?: number): PriceLevel[] {
    const entries = Array.from(this.map.entries());
    const sorted = entries.sort((a, b) =>
      ascending ? a[0] - b[0] : b[0] - a[0],
    );
    const result = limit ? sorted.slice(0, limit) : sorted;
    return result.map(([price, volume]) => [price, volume]);
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
