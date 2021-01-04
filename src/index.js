import Logger from './lib/logger'
import Container from './container'

import logform from "logform"
import tripleBeam from "triple-beam"
import winston from "winston"

export default class DiscordBot {
  /**
   * Logger object
   * @type {import("./lib/logger").default}
   */
  #logger = void 0;

  /**
   * Container object
   * @type {import("./container").default}
   */
  #container = void 0;

  /**
   * Path to config file
   * @type {Object}
   */
  #configPath = void 0;

  /**
   * Binding context for services
   * @type {Object}
   */
  #bindingContext = void 0;

  /**
   * Constants for the service
   * @type {Object}
   */
  #constants = void 0;

  constructor(configPath) {
    // @ts-ignore
    this.#logger = new Logger(require(configPath), {logform, tripleBeam, winston});
    this.#container = new Container();

    this.#configPath = configPath;

    this.#bindingContext = {};
  }

  static createServer(configPath) {
    const server = new DiscordBot(configPath);
    return server.start();
  }

  get bindings() {
    return this.#bindingContext;
  }

  async start() {
    try {
      this.#container.loadDependencies(
        this,
        this.#configPath
      );

      await this.#bindingContext.discordService.start();

      this.#logger.info('Started Discord Bot');

      return this;
    } catch (e) {
      this.#logger.error(e.toString());
      throw e;
    }
  }

  async stop() {
    await this.#bindingContext.discordService.stop();

    this.#logger.info('Stopped Discord Bot');
  }
};
