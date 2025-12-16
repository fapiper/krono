import { BaseManager, type Logger } from './index';

export abstract class BaseConfig<
  TConfig,
  TEventMap extends Record<string, unknown>,
> extends BaseManager<TEventMap> {
  protected _config: TConfig;
  protected abstract readonly updateAllEventKey: keyof TEventMap;

  constructor(logger: Logger, prefix: string, config: TConfig) {
    super(logger, prefix);
    this._config = config;
  }

  override emit<K extends keyof TEventMap>(event: K, data: TEventMap[K]): void {
    super.emit(event, data);
    if (event !== this.updateAllEventKey) {
      super.emit(
        this.updateAllEventKey,
        this._config as TEventMap[typeof this.updateAllEventKey],
      );
    }
  }
}
