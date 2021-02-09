import Logger from "./lib/logger";
import Container from "./container";

import logform from "logform";
import tripleBeam from "triple-beam";
import winston from "winston";

export default class DiscordBot {
  private container: Container = new Container();
  private logger: Logger;
  private configPath: String = void 0;
  private bindingContext: { [x: string]: any } = void 0;

  constructor(configPath: string) {
    this.logger = new Logger(require(configPath), {
      logform,
      tripleBeam,
      winston,
    });
    this.container = new Container();

    this.configPath = configPath;

    this.bindingContext = {};
  }

  static createServer(configPath: string) {
    const server = new DiscordBot(configPath);
    return server.start();
  }

  get bindings() {
    return this.bindingContext;
  }

  async start() {
    try {
      this.container.loadDependencies(this, this.configPath);

      await this.bindingContext.discordService.start();

      this.logger.info("Started Discord Bot");

      return this;
    } catch (e) {
      this.logger.error(e.toString());
      throw e;
    }
  }

  async stop() {
    this.bindingContext.discordService.stop();

    this.logger.info("Stopped Discord Bot");
  }
}
