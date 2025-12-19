import type { OrderbookData } from '../types';
import { UpdateProcessingStrategy } from './update-processing-strategy';

/**
 * Rate limits updates (emits at most once per interval)
 */
export class ThrottleStrategy extends UpdateProcessingStrategy<OrderbookData> {
  private pending: OrderbookData | null = null;
  private timer: number | null = null;

  constructor(private readonly delay: number) {
    super();
  }

  handle(data: OrderbookData) {
    this.pending = data;

    if (!this.timer) {
      this.timer = setTimeout(() => {
        if (this.pending) {
          this.emit('update', this.pending);
          this.pending = null;
        }
        this.timer = null;
      }, this.delay);
    }
  }

  clear() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.pending = null;
  }

  destroy() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    this.pending = null;
  }
}
