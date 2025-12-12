import { TypedEventEmitter } from '../events';

/**
 * Base class for update processing modules
 */
export abstract class UpdateProcessingStrategy<T> extends TypedEventEmitter<{
  update: T;
}> {
  abstract handle(value: T): void;
  abstract destroy(): void;
}
