import CommandError from "./command-error"
export default class CommandInvalidArgumentError extends CommandError {
  constructor(argumentType, context) {
    super("Invalid argument", context);
  }
}
