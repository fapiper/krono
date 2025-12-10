import type { Logger } from '../base';
import { TypedEventEmitter } from '../events';

export abstract class BaseManager<
  TEventMap extends Record<string, unknown>,
> extends TypedEventEmitter<TEventMap> {
  protected readonly log: Logger;

  constructor(logger: Logger, prefix: string) {
    super();

    this.log = logger;
    this.log.prefix = prefix;
  }
}
