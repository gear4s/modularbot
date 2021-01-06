import type ContextUtil from "../util/context";

export default class CommandError extends Error {
  context: typeof ContextUtil

  /**
   * Construct a command error
   */
  constructor(errorMessage: string, context: typeof ContextUtil) {
    super(errorMessage);
    this.context = context;
  }
}
