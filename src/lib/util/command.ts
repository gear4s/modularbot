import InvalidArgumentTypeError from "../errors/command-invalid-argument-type-error";
import Discord from "discord.js";

/* eslint-disable no-unused-vars */
import type ContextType from "./context";
/* eslint-enable no-unused-vars */

/* eslint-disable no-undef */
export type ValidCommandArguments =
  | typeof String
  | typeof Number
  | typeof Boolean
  | typeof Discord.TextChannel
  | typeof Discord.VoiceChannel
  | typeof Discord.NewsChannel
  | typeof Discord.StoreChannel
  | typeof Discord.User;

const VALID_ARGS: ValidCommandArguments[] = [
  String,
  Number,
  Boolean,
  Discord.TextChannel,
  Discord.VoiceChannel,
  Discord.NewsChannel,
  Discord.StoreChannel,
  Discord.User,
];

export type CommandObject = {
  name: string;
  args: ValidCommandArguments[];
  description?: string;
  callback: (ctx: ContextType, ...args: any[]) => void | Promise<void>;
};
/* eslint-enable no-undef */

export class ChainableCommand {
  private commandObject: CommandObject = {
    name: null,
    args: null,
    description: null,
    callback: null,
  };

  constructor(commandObject?: CommandObject) {
    commandObject?.name && (this.commandObject.name = commandObject.name);
    commandObject?.args && (this.commandObject.args = commandObject.args);
    commandObject?.description &&
      (this.commandObject.description = commandObject.description);
    commandObject?.callback &&
      (this.commandObject.callback = commandObject.callback);

    this.validateArgs();
  }

  private validateArgs(args: CommandObject["args"] = null) {
    args || (args = this.commandObject.args);

    if (args === null) return;
    if (!Array.isArray(args))
      throw new Error("Args have to be an array of types");

    for (const arg of args) {
      if (!VALID_ARGS.includes(arg)) throw new InvalidArgumentTypeError(arg);
    }
  }

  toJSON(): CommandObject {
    return { ...this.commandObject };
  }

  withName = (name: CommandObject["name"]): ChainableCommand => {
    this.commandObject.name = name;
    return this;
  };

  withArgs = (args: CommandObject["args"]): ChainableCommand => {
    this.validateArgs(args);
    this.commandObject.args = args;
    return this;
  };

  withDescription = (
    description: CommandObject["description"]
  ): ChainableCommand => {
    this.commandObject.description = description;
    return this;
  };

  withDesc = (desc: CommandObject["description"]) => {
    return this.withDescription(desc);
  };

  /**
   *
   * @param {(callback: import("./context").default) => void} callback
   */
  withCallback = (callback: CommandObject["callback"]): ChainableCommand => {
    this.commandObject.callback = callback;
    return this;
  };

  withCb = (cb: CommandObject["callback"]) => {
    return this.withCallback(cb);
  };
}
