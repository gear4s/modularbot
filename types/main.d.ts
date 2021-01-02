interface Logger {
  /**
   * Logs an info message to the console
   */
  info(msg: string): void;

  /**
   * Logs a debug message to the console
   */
  debug(msg: string): void;

  /**
   * Logs a warning message to the console
   */
  warn(msg: string): void;

  /**
   * Logs an error message to the console
   */
  error(msg: string, error?: Error): void;

  /**
   * Sets logging level
   */
  setLevel(level: "error" | "warn" | "info" | "http" | "verbose" | "debug" | "silly"): void
}
