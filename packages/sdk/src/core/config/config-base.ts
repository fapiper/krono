import { TypedEventEmitter } from '../events';

export abstract class ConfigBase<
  TConfig,
  TEventMap extends Record<string, unknown>,
> extends TypedEventEmitter<TEventMap> {
  protected _config: TConfig;
  protected abstract readonly updateAllEventKey: keyof TEventMap;

  constructor(config: TConfig) {
    super();
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
