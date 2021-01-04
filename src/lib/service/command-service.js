import { EventEmitter } from "events"

export default class CommandService extends EventEmitter {
  /**
   * @type {Logger}
   */
  #logger = void 0;

  /**
   * @type {typeof import("../config").default}
   */
  #config = void 0;

  /**
   * @type {(value: any) => boolean}
   */
  #boolean = void 0;

  /**
   * @type {{
   *  discord: import("./discord-service").default
   * }}
   */
  #services = {};

  /**
   * @type {{
   *  string: typeof import("../util/string").default
   *  context: typeof import("../util/context").default
   *  command: typeof import("../util/command")
   * }}
   */
  #utils = {};

  /**
   * @type {Object[]}
   */
  #commands = [];

  /**
   * 
   * @param {Logger} logger 
   * @param {typeof import("../config").default} config 
   * @param {{
   *  discord: require("discord.js"),
   *  mongoose: require("mongoose"),
   *  fs: require("fs"),
   *  path: require("path"),
   *  logform: require('logform'),
   *  tripleBeam: require('triple-beam'),
   *  winston: require('winston'),
   *  boolean: require('boolean')
   * }} libraries 
   * @param {import("./discord-service").default} discordService 
   * @param {typeof import("../util/string").default} stringUtil 
   * @param {typeof import("../util/context").default} contextUtil 
   * @param {typeof import("../util/command")} commandUtil 
   */
  constructor(logger, config, libraries, discordService, stringUtil, contextUtil, commandUtil) {
    super();

    this.#logger = logger;
    this.#config = config;
    this.#boolean = libraries.boolean;
    this.#services.discord = discordService;
    this.#utils.string = stringUtil;
    this.#utils.context = contextUtil;
    this.#utils.command = commandUtil;

    this.init();
  }

  /**
   * @private
   */
  init() {
    this.#logger.debug("Initializing command service");

    this.#services.discord.app.on('message', async msg => {
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
      this.#logger.error(null, e);
    });
  }

  /**
   * @private
   * @returns {String[]}
   */
  get prefix() {
    return this.#config.bot.prefix
      .split(/(?<!\\),/g)
      .map(prefix => prefix.replace("\\,", ","));
  }

  /**
   * @private
   * @param {import("discord.js").Message} msg 
   */
  getContext(msg) {
    const view = new this.#utils.string(msg.content);

    const ctx = new this.#utils.context(
      this.#boolean, this.#services.discord.app, null, view, msg
    )

    const prefix = this.prefix;
    let invokedPrefix = prefix;

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
    ctx.command = this.#commands.find(({name}) => name === invoker) || null;
    return ctx;
  }

  /**
   * Register a new command
   * @public
   * @param {import("../util/command").ChainableCommand} command The command object to register
   */
  register = command => {
    if(!(command instanceof this.#utils.command.ChainableCommand)) {
      throw new Error("Command must be an object of the Chainable Command class")
    }

    const jsonCommand = command.toJSON();

    const commandExists = this.#commands.some(({name}) => name === jsonCommand.name);
    if(commandExists) {
      throw new Error(`Command \`${jsonCommand.name}\` already exists`)
    }

    this.#commands.push(jsonCommand);
  }
}
