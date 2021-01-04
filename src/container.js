import Injector from 'totally-di'
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

  loadDependencies (context, configPath) {
    this.#bindingContext = context.bindings;
    this.#config = require(configPath).default;
    this.#logger = new Logger(this.#config, {logform, tripleBeam, winston});

    try {
      this.__registerDependencies();
      this.__resolveDependencies();
      this.#logger.info('Dependencies set up');
    } catch (e) {
      this.#logger.error(e);
      throw e;
    }
  }

  __registerDependencies () {
    this.__injector.register('libraries', {
      discord: require("discord.js"),
      mongoose: require("mongoose"),
      fs: require("fs"),
      path: require("path"),
      logform: require('logform'),
      tripleBeam: require('triple-beam'),
      winston: require('winston')
    });

    this.__injector.registerRawObject('config', this.#config);
    this.__injector.registerSingleton('logger', Logger, ['config', 'libraries']);
    this.__injector.registerSingleton('discord-service', require("./lib/service/discord-service").default, ['logger', 'config', 'libraries']);
    this.__injector.registerSingleton('command-service', require("./lib/service/command-service").default, ['logger', 'config', 'discord-service', 'string-util', , 'context-util', 'command-util']);
    this.__injector.registerSingleton('test-command-service', require("./lib/service/test-command-service").default, ['logger', 'config', 'command-service', 'command-util']);

    this.__injector.registerRawObject('string-util', require("./lib/util/string").default);
    this.__injector.registerRawObject('context-util', require("./lib/util/context").default);
    this.__injector.registerRawObject('command-util', require("./lib/util/command"));
  }

  __resolveDependencies () {
    this.#bindingContext.discordService = this.__injector.resolve('discord-service');
    this.#bindingContext.commandService = this.__injector.resolve('command-service');
    this.#bindingContext.testCommandService = this.__injector.resolve('test-command-service');
    this.#bindingContext.stringUtil = this.__injector.resolve('string-util');
    this.#bindingContext.contextUtil = this.__injector.resolve('context-util');
  }
};
