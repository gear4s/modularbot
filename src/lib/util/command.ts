import InvalidArgumentTypeError from "../errors/command-invalid-argument-type-error"
import Discord from "discord.js"
import type ContextType from "./context";

type ValidCommandArguments = typeof String | typeof Number | typeof Boolean | typeof Discord.TextChannel | true
const VALID_ARGS: ValidCommandArguments[] = [String, Number, Boolean, Discord.TextChannel, true]

export type CommandObject = {
  name: string
  args: ValidCommandArguments[]
  description?: string
  callback: (ctx: ContextType, ...args: any[]) => void
}

export class ChainableCommand {
  private commandObject: CommandObject = {
    name: null,
    args: null,
    description: null,
    callback: null
  }

  constructor(commandObject?: CommandObject) {
    commandObject?.name && (this.commandObject.name = commandObject.name);
    commandObject?.args && (this.commandObject.args = commandObject.args);
    commandObject?.description && (this.commandObject.description = commandObject.description);
    commandObject?.callback && (this.commandObject.callback = commandObject.callback);

    this.validateArgs();
  }

  private validateArgs(args: ValidCommandArguments[] = null) {
    args || (args = this.commandObject.args);

    if(args === null) return;
    if(!Array.isArray(args)) throw new Error("Args have to be an array of types");

    for(const arg of args) {
      if(!VALID_ARGS.includes(arg)) throw new InvalidArgumentTypeError(arg);
    }
  }

  toJSON() {
    return {...this.commandObject};
  }

  withName = name => {
    this.commandObject.name = name;
    return this;
  }

  withArgs = (args: ValidCommandArguments[]) => {
    this.validateArgs(args);
    this.commandObject.args = args;
    return this;
  }

  withDescription = (description: string) => {
    this.commandObject.description = description;
    return this;
  }

  withDesc = (desc: string) => {
    return this.withDescription(desc);
  }

  /**
   * 
   * @param {(callback: import("./context").default) => void} callback 
   */
  withCallback = (callback: (ctx: ContextType, ...args) => void) => {
    this.commandObject.callback = callback;
    return this;
  }

  withCb = (cb: (ctx: ContextType, ...args) => void) => {
    return this.withCallback(cb);
  }
}
