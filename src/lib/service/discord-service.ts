/* eslint-disable no-unused-vars */
import type Discord from "discord.js";
import type Logger from "../logger";
import type Config from "../config";
import type { Libraries } from "../../container";
/* eslint-enable no-unused-vars */

export default class DiscordService {
  #discord: typeof Discord;
  #app: Discord.Client;
  #logger: Logger;
  #botToken: string;

  constructor(logger: Logger, config: typeof Config, libraries: Libraries) {
    this.#discord = libraries.discord;
    this.#logger = logger;

    this.#botToken = config.bot.token;

    this.init();
  }

  get app() {
    return this.#app || (this.#app = new this.#discord.Client());
  }

  init() {
    this.app.on("ready", () => {
      this.#logger.debug(`Logged in as ${this.app.user.tag}!`);
    });
  }

  async start() {
    await this.app.login(this.#botToken);
  }

  stop() {
    this.app.destroy();
  }
}
