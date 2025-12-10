import { BaseConfig, type Logger } from '../base';
import { mergeDeep } from '../utils';
import {
  OrderbookConfigEventKey,
  type OrderbookConfigEventMap,
} from './events';
import type { IOrderbookConfig, OrderbookConfigOptions } from './types';

/**
 * Orderbook manages market depth updates from Kraken.
 */
export class OrderbookConfigManager
  extends BaseConfig<IOrderbookConfig, OrderbookConfigEventMap>
  implements IOrderbookConfig
{
  private static readonly _defaultConfig = {
    depth: 25,
    maxHistoryLength: 86_400,
    historyEnabled: true,
    spreadGrouping: 0.1,
    debug: false,
    throttleMs: 1_000,
    debounceMs: undefined,
    reconnect: {
      enabled: true,
      maxAttempts: 5,
      delayMs: 3000,
    },
  };
  protected readonly updateAllEventKey = OrderbookConfigEventKey.ConfigUpdate;

  constructor(logger: Logger, config: OrderbookConfigOptions) {
    super(
      logger,
      'OrderbookConfig',
      mergeDeep(OrderbookConfigManager._defaultConfig, config),
    );
  }

  /**
   * Returns configured trading symbol.
   */
  get symbol(): string {
    return this._config.symbol;
  }

  /**
   * Updates symbol and reconnects.
   */
  set symbol(value: string) {
    if (this._config.symbol !== value) {
      this._config.symbol = value;
      this.log.debug(`Symbol updated to ${value}.`);
      this.emit(OrderbookConfigEventKey.ConfigSymbolUpdate, value);
    }
  }

  /**
   * Returns configured orderbook depth.
   */
  get depth() {
    return this._config.depth;
  }

  /**
   * Updates depth and reconnects if necessary.
   */
  set depth(value) {
    if (this._config.depth !== value) {
      this._config.depth = value;
      this.log.debug(`Depth updated to ${value}`);
      this.emit(OrderbookConfigEventKey.ConfigDepthUpdate, value);
    }
  }

  /**
   * Returns throttle time.
   */
  get throttleMs() {
    return this._config.throttleMs;
  }

  /**
   * Updates throttle time and rebuilds pipeline.
   */
  set throttleMs(value) {
    if (this._config.throttleMs !== value) {
      this._config.throttleMs = value;
      this.log.debug(`Throttle updated to ${value}.`);
      this.emit(OrderbookConfigEventKey.ConfigThrottleMsUpdate, value);
    }
  }

  /**
   * Returns debounce time.
   */
  get debounceMs() {
    return this._config.debounceMs;
  }

  /**
   * Updates debounce time and rebuilds pipeline.
   */
  set debounceMs(value) {
    if (this._config.debounceMs !== value) {
      this._config.debounceMs = value;
      this.log.debug(`Debounce updated to ${value}.`);
      this.emit(OrderbookConfigEventKey.ConfigDebounceMsUpdate, value);
    }
  }

  /**
   * Returns whether history recording is enabled.
   */
  get historyEnabled(): boolean {
    return this._config.historyEnabled;
  }

  /**
   * Enables or disables history recording.
   */
  set historyEnabled(value) {
    if (this._config.historyEnabled !== value) {
      this._config.historyEnabled = value;
      this.log.debug(`History recording ${value ? 'enabled' : 'disabled'}.`);
      this.emit(OrderbookConfigEventKey.ConfigHistoryEnabledUpdate, value);
    }
  }

  /**
   * Returns spread grouping percentage.
   */
  get spreadGrouping() {
    return this._config.spreadGrouping;
  }

  /**
   * Updates spread grouping for visual display.
   */
  set spreadGrouping(value) {
    if (this._config.spreadGrouping !== value) {
      this._config.spreadGrouping = value;
      this.log.debug(`Spread grouping updated to ${value}.`);
      this.emit(OrderbookConfigEventKey.ConfigSpreadGroupingUpdate, value);
    }
  }

  /**
   * Returns max history length.
   */
  get maxHistoryLength() {
    return this._config.maxHistoryLength;
  }

  /**
   * Updates max history length and resizes buffer.
   */
  set maxHistoryLength(value) {
    if (this._config.maxHistoryLength !== value) {
      this._config.maxHistoryLength = value;
      this.log.debug(`Max history length updated to ${value}.`);
      this.emit(OrderbookConfigEventKey.ConfigMaxHistoryLengthUpdate, value);
    }
  }

  get debug() {
    return this._config.debug;
  }

  set debug(value) {
    if (this._config.debug !== value) {
      this._config.debug = value;
      this.log.debug(`Debug mode ${value ? 'enabled' : 'disabled'}.`);
      this.log.enabled = value;
      this.emit(OrderbookConfigEventKey.ConfigDebugUpdate, value);
    }
  }

  get reconnect() {
    return this._config.reconnect;
  }

  set reconnect(value) {
    const { enabled, maxAttempts, delayMs } = this._config.reconnect;
    const changed =
      value.enabled !== enabled ||
      value.maxAttempts !== maxAttempts ||
      value.delayMs !== delayMs;

    if (changed) {
      const reconnect = mergeDeep(this._config.reconnect, value);
      this._config.reconnect = reconnect;
      this.log.debug(`Reconnect updated to ${JSON.stringify(reconnect)}.`);
      this.emit(OrderbookConfigEventKey.ConfigReconnectUpdate, reconnect);
    }
  }

  onUpdateConfig = this.createListener(OrderbookConfigEventKey.ConfigUpdate);
  onUpdateConfigSymbol = this.createListener(
    OrderbookConfigEventKey.ConfigSymbolUpdate,
  );
  onUpdateConfigDepth = this.createListener(
    OrderbookConfigEventKey.ConfigDepthUpdate,
  );
  onUpdateConfigMaxHistoryLength = this.createListener(
    OrderbookConfigEventKey.ConfigMaxHistoryLengthUpdate,
  );
  onUpdateConfigHistoryEnabled = this.createListener(
    OrderbookConfigEventKey.ConfigHistoryEnabledUpdate,
  );
  onUpdateConfigSpreadGrouping = this.createListener(
    OrderbookConfigEventKey.ConfigSpreadGroupingUpdate,
  );
  onUpdateConfigDebug = this.createListener(
    OrderbookConfigEventKey.ConfigDebugUpdate,
  );
  onUpdateConfigThrottleMs = this.createListener(
    OrderbookConfigEventKey.ConfigThrottleMsUpdate,
  );
  onUpdateConfigDebounceMs = this.createListener(
    OrderbookConfigEventKey.ConfigDebounceMsUpdate,
  );
  onUpdateConfigReconnect = this.createListener(
    OrderbookConfigEventKey.ConfigReconnectUpdate,
  );
}
