import { mergeDeep } from '../utils';

export type LoggerOptions = {
  enabled?: boolean;
  prefix?: string;
};

export class Logger {
  private instance: Logger | null;
  private options: LoggerOptions;

  private static readonly defaultConfig = {
    enabled: false,
  };

  constructor(instance: Logger | null, options: LoggerOptions = {}) {
    this.instance = instance;
    this.options = mergeDeep(Logger.defaultConfig, options);
  }

  static init(options: LoggerOptions = {}) {
    return new Logger(null, mergeDeep(Logger.defaultConfig, options));
  }

  get(): Logger {
    return this.instance ?? this;
  }

  build(options: Omit<LoggerOptions, 'enabled'> = {}): Logger {
    return new Logger(this.get(), options);
  }

  private format(message: unknown): string {
    return this.prefix ? `[${this.prefix}] ${message}` : String(message);
  }

  debug(...args: unknown[]) {
    if (!this.enabled) return;
    console.debug(this.format(args[0]), ...args.slice(1));
  }

  info(...args: unknown[]) {
    if (!this.enabled) return;
    console.log(this.format(args[0]), ...args.slice(1));
  }

  error(...args: unknown[]) {
    console.error(this.format(args[0]), ...args.slice(1));
  }

  get prefix() {
    return this.options.prefix;
  }

  set prefix(value: string | undefined) {
    this.options.prefix = value;
  }

  get enabled() {
    return this.get().options.enabled;
  }

  set enabled(value: boolean | undefined) {
    this.get().options.enabled = value;
  }
}
