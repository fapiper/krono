import type { OrderbookSnapshot } from '../types';
import { UpdateProcessingStrategy } from './update-processing-strategy';

/**
 * Rate limits updates (emits at most once per interval)
 */
export class ThrottleStrategy extends UpdateProcessingStrategy<OrderbookSnapshot> {
  private pending: OrderbookSnapshot | null = null;
  private timer: NodeJS.Timeout | null = null;

  constructor(private readonly delay: number) {
    super();
  }

  handle(snapshot: OrderbookSnapshot) {
    this.pending = snapshot;

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

  destroy() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    this.pending = null;
  }
}
