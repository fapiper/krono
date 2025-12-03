/**
 * Circular buffer for storing historical snapshots
 */
export class HistoryBuffer<T> {
  private buffer: T[] = [];
  private maxLength: number;

  constructor(maxLength = 1000) {
    this.maxLength = maxLength;
  }

  /**
   * Add item to buffer
   */
  push(item: T): void {
    this.buffer.push(item);

    // Remove oldest if exceeds max length
    if (this.buffer.length > this.maxLength) {
      this.buffer.shift();
    }
  }

  /**
   * Get item at index
   */
  get(index: number): T | undefined {
    return this.buffer[index];
  }

  /**
   * Get all items
   */
  getAll(): T[] {
    return [...this.buffer];
  }

  /**
   * Get latest item
   */
  getLatest(): T | undefined {
    return this.buffer[this.buffer.length - 1];
  }

  /**
   * Clear all items
   */
  clear(): void {
    this.buffer = [];
  }

  /**
   * Get buffer size
   */
  get size(): number {
    return this.buffer.length;
  }

  /**
   * Check if empty
   */
  get isEmpty(): boolean {
    return this.buffer.length === 0;
  }

  /**
   * Update max length
   */
  setMaxLength(maxLength: number): void {
    this.maxLength = maxLength;

    // Trim if current size exceeds new max
    while (this.buffer.length > maxLength) {
      this.buffer.shift();
    }
  }
}
