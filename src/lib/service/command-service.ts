import { EventEmitter } from "events"
import type Logger from "../logger";
import type Config from "../config";
import type { boolean as BooleanType } from "boolean"
import type * as Discord from "discord.js";
import type DiscordService from "./discord-service";
import type Context from "../util/context";
import type * as Command from "../util/command";
import type StringView from "../util/string";
import type { Libraries } from "~/container";
import type ContextUtil from "../util/context";

export default class CommandService extends EventEmitter {
  private logger: Logger;
  private config: typeof Config;
  private boolean: typeof BooleanType;
  private discord: typeof Discord;
  private services: {
    discord: DiscordService
  };

  private utils: {
    string: typeof StringView
    context: typeof Context
    command: typeof Command
  };

  private commands: Command.CommandObject[] = [];

  constructor(
    logger: Logger,
    config: typeof Config,
    libraries: Libraries,
    discordService: DiscordService,
    stringUtil: typeof StringView,
    contextUtil: typeof ContextUtil,
    commandUtil: typeof Command
  ) {
    super();

    this.logger = logger;
    this.config = config;
    this.discord = libraries.discord;
    this.boolean = libraries.boolean;
    this.services = {
      discord: discordService
    }
    this.utils = {
      string: stringUtil,
      context: contextUtil,
      command: commandUtil
    }

    this.init();
  }

  /**
   * @private
   */
  init() {
    this.logger.debug("Initializing command service");

    this.services.discord.app.on('message', async msg => {
      if (msg.author.bot) return;

      const ctx = this.getContext(msg);
      if(!ctx.valid) return;

      try {
        await ctx.invoke();
      } catch(e) {
        this.emit("command-error", e);
      }
    });

    this.on("command-error", e => {
      this.logger.error(null, e);
    });
  }

  /**
   * @private
   * @returns {String[]}
   */
  get prefix() {
    return this.config.bot.prefix
      .split(/(?<!\\),/g)
      .map(prefix => prefix.replace("\\,", ","));
  }

  /**
   * @private
   * @param {import("discord.js").Message} msg 
   * @returns {Context}
   */
  getContext(msg) {
    const view = new this.utils.string(msg.content);

    /** @type {Context} */
    const ctx = new this.utils.context(
      this.discord, this.boolean, this.services.discord.app, null, view, msg
    )

    const prefix = this.prefix;
    let invokedPrefix: string | string[] = prefix;

    try {
      if (prefix.some(prefix => msg.content.startsWith(prefix))) {
        invokedPrefix = prefix.find(prefix => view.skipString(prefix));
      } else {
        return ctx;
      }
    } catch(e) {
      throw new Error("Iterable `defaultPrefix` or list returned from `prefix` must contain only strings");
    }

    const invoker = view.getWord();
    ctx.invokedWith = invoker;
    ctx.prefix = invokedPrefix;
    ctx.command = this.commands.find(({name}) => name === invoker) || null;
    return ctx;
  }

  /**
   * Register a new command
   * @public
   * @param {import("../util/command").ChainableCommand} command The command object to register
   */
  register = command => {
    if(!(command instanceof this.utils.command.ChainableCommand)) {
      throw new Error("Command must be an object of the Chainable Command class")
    }

    const jsonCommand = command.toJSON();

    const commandExists = this.commands.some(({name}) => name === jsonCommand.name);
    if(commandExists) {
      throw new Error(`Command \`${jsonCommand.name}\` already exists`)
    }

    this.commands.push(jsonCommand);
  }
}
