import { BaseConfig, type Logger } from '../base';
import { mergeDeep } from '../utils';
import {
  OrderbookConfigEventKey,
  type OrderbookConfigEventMap,
} from './events';
import type { IOrderbookConfig, OrderbookConfigOptions } from './types';
import { generateGroupingOptions } from './utils';

const KRAKEN_DEPTHS = [10, 25, 100, 500, 1000] as const;

/**
 * Owns, validates, and mutates orderbook configuration.
 *
 * Emits fine-grained update events as well as a global config update.
 *
 * @internal
 */
export class OrderbookConfigManager
  extends BaseConfig<IOrderbookConfig, OrderbookConfigEventMap>
  implements IOrderbookConfig
{
  /** Default configuration values */
  private static readonly _defaultConfig = {
    limit: 25,
    depth: 1_000,
    maxHistoryLength: 86_400,
    historyEnabled: true,
    tickSize: 0.1,
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

  private _groupingOptions: number[];

  protected readonly updateAllEventKey = OrderbookConfigEventKey.ConfigUpdate;

  /**
   * @param logger Shared logger
   * @param config User-provided orderbook configuration
   */
  constructor(logger: Logger, config: OrderbookConfigOptions) {
    super(
      logger,
      'OrderbookConfig',
      mergeDeep(OrderbookConfigManager._defaultConfig, config),
    );
    this._groupingOptions = generateGroupingOptions(this.tickSize);
  }

  /**
   * Maps limit to Kraken-supported depth.
   */
  private getRequiredDepth(limit: number): 10 | 25 | 100 | 500 | 1000 {
    return KRAKEN_DEPTHS.find((d) => d >= limit) ?? 1000;
  }

  get groupingOptions(): number[] {
    return this._groupingOptions;
  }

  get symbol(): string {
    return this._config.symbol;
  }

  set symbol(value: string) {
    if (this._config.symbol !== value) {
      this._config.symbol = value;
      this.log.debug(`Symbol updated to ${value}.`);
      this.emit(OrderbookConfigEventKey.ConfigSymbolUpdate, value);
    }
  }

  get limit() {
    return this._config.limit;
  }

  /**
   * Updates limit and reconnects if necessary.
   */
  set limit(value) {
    if (this._config.limit !== value) {
      this._config.limit = value;
      this.log.debug(`Limit updated to ${value}`);

      const required = this.getRequiredDepth(value);
      if (this.depth < required) {
        this.log.info(
          `Auto-adjusting depth: Limit (${value}) requires at least ${required} (Current: ${this.depth})`,
        );
        this.depth = required;
      }

      this.emit(OrderbookConfigEventKey.ConfigLimitUpdate, value);
    }
  }

  get depth() {
    return this._config.depth;
  }

  set depth(value) {
    if (this._config.depth !== value) {
      this._config.depth = value;
      this.log.debug(`Depth updated to ${value}`);
      this.emit(OrderbookConfigEventKey.ConfigDepthUpdate, value);
    }
  }

  get throttleMs() {
    return this._config.throttleMs;
  }

  set throttleMs(value) {
    if (this._config.throttleMs !== value) {
      this._config.throttleMs = value;
      this.log.debug(`Throttle updated to ${value}.`);
      this.emit(OrderbookConfigEventKey.ConfigThrottleMsUpdate, value);
    }
  }

  get debounceMs() {
    return this._config.debounceMs;
  }

  set debounceMs(value) {
    if (this._config.debounceMs !== value) {
      this._config.debounceMs = value;
      this.log.debug(`Debounce updated to ${value}.`);
      this.emit(OrderbookConfigEventKey.ConfigDebounceMsUpdate, value);
    }
  }

  get historyEnabled(): boolean {
    return this._config.historyEnabled;
  }

  set historyEnabled(value) {
    if (this._config.historyEnabled !== value) {
      this._config.historyEnabled = value;
      this.log.debug(`History recording ${value ? 'enabled' : 'disabled'}.`);
      this.emit(OrderbookConfigEventKey.ConfigHistoryEnabledUpdate, value);
    }
  }

  get tickSize(): number {
    return this._config.tickSize;
  }

  set tickSize(value: number) {
    if (this._config.tickSize !== value) {
      this._config.tickSize = value;
      this.log.debug(`Tick size updated to ${value}`);

      // Regenerate valid grouping options
      this._groupingOptions = generateGroupingOptions(value);

      // If current grouping is invalid for new tick size, reset to minimum
      if (this.spreadGrouping < value) {
        this.spreadGrouping = value;
      }

      // Note: You might want to add a specific event for tickSize update if needed
      this.emit(OrderbookConfigEventKey.ConfigUpdate, this._config);
    }
  }

  get spreadGrouping() {
    return this._config.spreadGrouping;
  }

  set spreadGrouping(value) {
    if (this._config.spreadGrouping !== value) {
      this._config.spreadGrouping = value;
      this.log.debug(`Spread grouping updated to ${value}.`);
      this.emit(OrderbookConfigEventKey.ConfigSpreadGroupingUpdate, value);
    }
  }

  get maxHistoryLength() {
    return this._config.maxHistoryLength;
  }

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
      if (!value) {
        this.log.debug('Debug mode disabled.');
      }
      this._config.debug = value;
      this.emit(OrderbookConfigEventKey.ConfigDebugUpdate, value);
      if (value) {
        this.log.debug('Debug mode enabled.');
      }
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

  // Event helpers

  onUpdateConfig = this.createListener(OrderbookConfigEventKey.ConfigUpdate);
  onUpdateConfigSymbol = this.createListener(
    OrderbookConfigEventKey.ConfigSymbolUpdate,
  );
  onUpdateConfigLimit = this.createListener(
    OrderbookConfigEventKey.ConfigLimitUpdate,
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
