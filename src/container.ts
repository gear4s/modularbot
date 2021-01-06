import Injector from 'totally-di'
import Logger from "./lib/logger"

import * as logform from "logform"
import * as tripleBeam from "triple-beam"
import winston from "winston"
import { Logger as LoggerType } from '../types'

import type Config from "./lib/config"

import Axios, { AxiosStatic } from "axios"
import type Discord from "discord.js"
export type Libraries = {
  [x: string]: any
  discord?: typeof Discord
  axios?: AxiosStatic
  winston?: typeof winston
  logform?: typeof logform
  tripleBeam?: typeof tripleBeam
}

export default class Container {
  private injector: Injector = Injector.getInstance();
  private bindingContext: { [x: string]: any };
  private config: typeof Config;
  private logger: LoggerType;

  loadDependencies (context, configPath) {
    this.bindingContext = context.bindings;
    this.config = require(configPath).default;
    this.logger = new Logger(this.config, {logform, tripleBeam, winston});

    try {
      this.__registerDependencies();
      this.__resolveDependencies();
      this.logger.info('Dependencies set up');
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  private __registerDependencies () {
    this.injector.register('libraries', {
      discord: require("discord.js"),
      mongoose: require("mongoose"),
      fs: require("fs"),
      path: require("path"),
      logform: require('logform'),
      tripleBeam: require('triple-beam'),
      winston: require('winston'),
      boolean: require('boolean').boolean,
      axios: Axios
    });

    this.injector.registerRawObject('config', this.config);
    this.injector.registerSingleton('logger', Logger, ['config', 'libraries']);
    this.injector.registerSingleton('discord-service', require("./lib/service/discord-service").default, ['logger', 'config', 'libraries']);
    this.injector.registerSingleton('command-service', require("./lib/service/command-service").default, ['logger', 'config', 'libraries', 'discord-service', 'string-util', , 'context-util', 'command-util']);
    this.injector.registerSingleton('test-command-service', require("./lib/service/test-command-service").default, ['logger', 'config', 'command-service', 'command-util']);
    this.injector.registerSingleton('twitch-service', require("./lib/service/twitch-service").default, ['logger', 'config', 'libraries', 'command-service', 'command-util']);

    this.injector.registerRawObject('string-util', require("./lib/util/string").default);
    this.injector.registerRawObject('context-util', require("./lib/util/context").default);
    this.injector.registerRawObject('command-util', require("./lib/util/command"));
  }

  private __resolveDependencies () {
    this.bindingContext.discordService = this.injector.resolve('discord-service');
    this.bindingContext.commandService = this.injector.resolve('command-service');
    this.bindingContext.testCommandService = this.injector.resolve('test-command-service');
    this.bindingContext.twitchService = this.injector.resolve('twitch-service');
    this.bindingContext.stringUtil = this.injector.resolve('string-util');
    this.bindingContext.contextUtil = this.injector.resolve('context-util');
    this.bindingContext.commandUtil = this.injector.resolve('command-util');
    this.bindingContext.libraries = this.injector.resolve('libraries');
  }
};
