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

import * as djs from "discord.js"

export interface Context {
  valid: Boolean

  guild: djs.Guild

  channel: djs.Channel

  author: djs.User

  me: djs.ClientUser

  send(
    content: djs.APIMessageContentResolvable | (djs.MessageOptions & { split?: false }) | djs.MessageAdditions,
  ): Promise<djs.Message>
  send(options: djs.MessageOptions & { split: true | djs.SplitOptions }): Promise<djs.Message[]>
  send(options: djs.MessageOptions | djs.APIMessage): Promise<djs.Message | djs.Message[]>
  send(content: djs.StringResolvable, options: (djs.MessageOptions & { split?: false }) | djs.MessageAdditions): Promise<djs.Message>
  send(content: djs.StringResolvable, options: djs.MessageOptions & { split: true | djs.SplitOptions }): Promise<djs.Message[]>
  send(content: djs.StringResolvable, options: djs.MessageOptions): Promise<djs.Message | djs.Message[]>

  args: Array<any>

  invoke(): Promise<void>;
}
