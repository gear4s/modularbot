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
  }

  toJSON() {
    return {...this.#commandObject};
  }

  withName = name => {
    this.#commandObject.name = name;
    return this;
  }

  withArgs = args => {
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
