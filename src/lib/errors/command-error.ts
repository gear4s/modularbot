/* eslint-disable no-unused-vars */
import type ContextUtil from "../util/context";
/* eslint-enable no-unused-vars */

export default class CommandError extends Error {
  context: typeof ContextUtil;

  /**
   * Construct a command error
   */
  constructor(errorMessage: string, context: typeof ContextUtil) {
    super(errorMessage);
    this.context = context;
  }
}
