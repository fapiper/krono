import { TypedEventEmitter } from '../base';
import type { UpdateProcessingStrategy } from './update-processing-strategy';

/**
 * Composes throttling / debouncing / filtering modules
 */
export class UpdatePipeline<T> extends TypedEventEmitter<{ update: T }> {
  private readonly strategies: UpdateProcessingStrategy<T>[] = [];

  add(strategy: UpdateProcessingStrategy<T>) {
    strategy.on('update', (snapshot) => this.emit('update', snapshot));
    this.strategies.push(strategy);
  }

  push(snapshot: T) {
    if (!this.strategies.length) {
      this.emit('update', snapshot);
      return;
    }
    for (const s of this.strategies) {
      s.handle(snapshot);
    }
  }

  destroy() {
    for (const s of this.strategies) {
      s.destroy();
    }
    this.removeAllListeners();
  }
}
