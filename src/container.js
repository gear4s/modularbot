import { ContainerV2 as Injector } from 'di-namic'
import Logger from "./lib/logger"

import logform from "logform"
import tripleBeam from "triple-beam"
import winston from "winston"

export default class Container {
  /**
   * Binding context for services
   * @type {Object}
   */
  #bindingContext = void 0;

  /**
   * Required config file
   * @type {Object}
   */
  #config = void 0;

  /**
   * Logger object
   * @type {import("core-service").Logger}
   */
  #logger = void 0;

  constructor () {
    this.__injector = Injector.getInstance();
  }

  async loadDependencies (context, configPath) {
    this.#bindingContext = context.bindings;
    this.#config = require(configPath).default;
    this.#logger = new Logger(this.#config, {logform, tripleBeam, winston});

    try {
      await this.__registerDependencies();
      await this.__resolveDependencies();
      this.#logger.info('Dependencies set up');
    } catch (e) {
      this.#logger.error(e);
      throw e;
    }
  }

  async __registerDependencies () {
    await this.__injector.register('libraries', {
      discord: require("discord.js"),
      mongoose: require("mongoose"),
      fs: require("fs"),
      path: require("path"),
      logform: require('logform'),
      tripleBeam: require('triple-beam'),
      winston: require('winston')
    });

    await this.__injector.register('config', this.#config);
    await this.__injector.registerSingleton('logger', Logger, ['config', 'libraries']);
    await this.__injector.registerSingleton('discord-service', require("./lib/service/discord-service").default, ['logger', 'config', 'libraries']);
  }

  async __resolveDependencies () {
    this.#bindingContext.discordService = await this.__injector.resolve('discord-service');
  }
};
