/* eslint-disable no-unused-vars */
import type Logger from "../logger";
import type Config from "../config";
import type { Libraries } from "../../container";
import type CommandService from "./command-service";
import type * as Command from "../util/command";
/* eslint-enable no-unused-vars */

export default class TestCommandService {
  #logger: Logger;
  #config: typeof Config;
  #discord: Libraries["discord"];

  #services: {
    command: CommandService;
  };

  #utils: {
    command: typeof Command;
  };

  constructor(
    logger: Logger,
    config: typeof Config,
    libraries: Libraries,
    commandService: CommandService,
    commandUtil: typeof Command
  ) {
    this.#logger = logger;
    this.#config = config;
    this.#discord = libraries.discord;

    this.#services = {
      command: commandService,
    };

    this.#utils = {
      command: commandUtil,
    };

    this.init();
  }

  private init() {
    this.#services.command.register(
      new this.#utils.command.ChainableCommand()
        .withName("test")
        .withArgs([
          String,
          Number,
          this.#discord.User,
          this.#discord.TextChannel,
        ])
        .withCallback(async (ctx, ...args) => {
          await ctx.channel.send(JSON.stringify(args, null, 2));
        })
    );
  }
}
