import InvalidArgumentTypeError from "../errors/command-invalid-argument-type-error"

const VALID_ARGS = [String, Number, Boolean, true]

export class ChainableCommand {
  #commandObject = {
    name: null,
    args: null,
    description: null,
    callback: null
  }

  constructor(commandObject) {
    commandObject?.name && (this.#commandObject.name = commandObject.name);
    commandObject?.args && (this.#commandObject.args = commandObject.args);
    commandObject?.description && (this.#commandObject.description = commandObject.description);
    commandObject?.callback && (this.#commandObject.callback = commandObject.callback);

    this.validateArgs();
  }

  /**
   * @private
   */
  validateArgs(args=null) {
    args || (args = this.#commandObject.args);

    if(args === null) return;
    if(!Array.isArray(args)) throw new Error("Args have to be an array of types");

    for(const arg of args) {
      if(!VALID_ARGS.includes(arg)) {
        throw new InvalidArgumentTypeError(arg, null);
      }
    }
  }

  toJSON() {
    return {...this.#commandObject};
  }

  withName = name => {
    this.#commandObject.name = name;
    return this;
  }

  withArgs = args => {
    this.validateArgs(args);
    this.#commandObject.args = args;
    return this;
  }

  withDescription = description => {
    this.#commandObject.description = description;
    return this;
  }

  withDesc = desc => {
    return this.withDescription(desc);
  }

  /**
   * 
   * @param {(callback: import("./context").default) => void} callback 
   */
  withCallback = callback => {
    this.#commandObject.callback = callback;
    return this;
  }

  withCb = cb => {
    return this.withCallback(cb);
  }
}
