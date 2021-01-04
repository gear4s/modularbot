export default class CommandError extends Error {
  /**
   * Construct a command error
   * @param {String} errorMessage 
   * @param {import("../util/context").default} context 
   */
  constructor(errorMessage, context) {
    super(errorMessage);
    this.context = context;
  }
}
