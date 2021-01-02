export default class DiscordService {
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
    this.__discord = libraries.discord;
    this.__logger = logger;

    this.__botToken = config.bot.token;

    this.__initialize();
  }

  get app() {
    return this.__app || (this.__app = new this.__discord.Client());
  }

  __initialize() {
    this.app.on("ready", () => {
      this.__logger.debug(`Logged in as ${this.app.user.tag}!`);
    });
  }

  async start() {
    this.app.login(this.__botToken);
  }

  async stop() {
    this.app.destroy();
  }
}
