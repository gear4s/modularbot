export default class DiscordService {

  /**
   * @type {import("discord.js")}
   */
  #discord = void 0;

  /**
   * @type {import("discord.js").Client}
   */
  #app = void 0;

  /**
   * @type {Logger}
   */
  #logger = void 0;

  /**
   * @type {String}
   */
  #botToken = void 0;

  /**
   * 
   * @param {Logger} logger
   * @param {typeof import("../config").default} config 
   * @param {{
   *  discord: import("discord.js"),
   *  mongoose: import("mongoose"),
   *  fs: import("fs"),
   *  path: import("path"),
   *  logform: import('logform'),
   *  tripleBeam: import('triple-beam'),
   *  winston: import('winston')
   * }} libraries
   */
  constructor(logger, config, libraries) {
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
