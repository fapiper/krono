import { TypedEventEmitter } from '../events';
import type { Logger } from './index';

export abstract class BaseManager<
  TEventMap extends Record<string, unknown>,
> extends TypedEventEmitter<TEventMap> {
  protected readonly log: Logger;

  protected constructor(logger: Logger, prefix: string) {
    super();

    this.log = logger.build({ prefix });
  }
}
