export type LoggerOptions = {
  enabled?: boolean;
  prefix?: string;
};

export class Logger {
  enabled: boolean;
  public prefix?: string;

  constructor(options?: LoggerOptions) {
    this.enabled = options?.enabled ?? false;
    this.prefix = options?.prefix;
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
    console.info(this.format(args[0]), ...args.slice(1));
  }

  error(...args: unknown[]) {
    console.error(this.format(args[0]), ...args.slice(1));
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }
}
