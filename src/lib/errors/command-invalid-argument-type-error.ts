import CommandError from "./command-error";
export default class CommandInvalidArgumentTypeError extends CommandError {
  constructor(argumentType) {
    super("Invalid argument type " + argumentType, null);
  }
}
