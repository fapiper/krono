import { Logger } from '../base';
import { OrderbookEventKey } from '../orderbook-events';
import { mergeDeep } from '../utils';
import { ConfigBase } from './config-base';
import type { OrderbookConfigEventMap } from './orderbook-config-events';
import type { IOrderbookConfig, OrderbookConfigOptions } from './types';

/**
 * Orderbook manages market depth updates from Kraken.
 */
export class OrderbookConfig
  extends ConfigBase<IOrderbookConfig, OrderbookConfigEventMap>
  implements IOrderbookConfig
{
  private _logger: Logger;
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
  protected readonly updateAllEventKey = OrderbookEventKey.ConfigUpdate;

  constructor(config: OrderbookConfigOptions) {
    super(mergeDeep(OrderbookConfig._defaultConfig, config));

    this._logger = new Logger({
      prefix: 'OrderbookConfig',
      enabled: this._config.debug,
    });
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
      this._logger.debug(`Symbol updated to ${value}.`);
      this.emit(OrderbookEventKey.ConfigSymbolUpdate, value);
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
      this._logger.debug(`Depth updated to ${value}`);
      this.emit(OrderbookEventKey.ConfigDepthUpdate, value);
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
      this._logger.debug(`Throttle updated to ${value}.`);
      this.emit(OrderbookEventKey.ConfigThrottleMsUpdate, value);
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
      this._logger.debug(`Debounce updated to ${value}.`);
      this.emit(OrderbookEventKey.ConfigDebounceMsUpdate, value);
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
      this._logger.debug(
        `History recording ${value ? 'enabled' : 'disabled'}.`,
      );
      this.emit(OrderbookEventKey.ConfigHistoryEnabledUpdate, value);
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
      this._logger.debug(`Spread grouping updated to ${value}.`);
      this.emit(OrderbookEventKey.ConfigSpreadGroupingUpdate, value);
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
      this._logger.debug(`Max history length updated to ${value}.`);
      this.emit(OrderbookEventKey.ConfigMaxHistoryLengthUpdate, value);
    }
  }

  get debug() {
    return this._config.debug;
  }

  set debug(value) {
    if (this._config.debug !== value) {
      this._config.debug = value;
      this._logger.debug(`Debug mode ${value ? 'enabled' : 'disabled'}.`);
      this._logger.enabled = value;
      this.emit(OrderbookEventKey.ConfigDebugUpdate, value);
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
      this._logger.debug(`Reconnect updated to ${JSON.stringify(reconnect)}.`);
      this.emit(OrderbookEventKey.ConfigReconnectUpdate, reconnect);
    }
  }

  onUpdateConfig = this.createListener(OrderbookEventKey.ConfigUpdate);
  onUpdateConfigSymbol = this.createListener(
    OrderbookEventKey.ConfigSymbolUpdate,
  );
  onUpdateConfigDepth = this.createListener(
    OrderbookEventKey.ConfigDepthUpdate,
  );
  onUpdateConfigMaxHistoryLength = this.createListener(
    OrderbookEventKey.ConfigMaxHistoryLengthUpdate,
  );
  onUpdateConfigHistoryEnabled = this.createListener(
    OrderbookEventKey.ConfigHistoryEnabledUpdate,
  );
  onUpdateConfigSpreadGrouping = this.createListener(
    OrderbookEventKey.ConfigSpreadGroupingUpdate,
  );
  onUpdateConfigDebug = this.createListener(
    OrderbookEventKey.ConfigDebugUpdate,
  );
  onUpdateConfigThrottleMs = this.createListener(
    OrderbookEventKey.ConfigThrottleMsUpdate,
  );
  onUpdateConfigDebounceMs = this.createListener(
    OrderbookEventKey.ConfigDebounceMsUpdate,
  );
  onUpdateConfigReconnect = this.createListener(
    OrderbookEventKey.ConfigReconnectUpdate,
  );
}
