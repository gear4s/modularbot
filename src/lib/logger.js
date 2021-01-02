export default class Logger {
  /**
   * 
   * @param {*} config 
   * @param {{
   *  discord: require("discord.js"),
   *  mongoose: require("mongoose"),
   *  fs: require("fs"),
   *  path: require("path"),
   *  logform: require('logform'),
   *  tripleBeam: require('triple-beam'),
   *  winston: require('winston')
   * }} libraries
   */
  constructor(config, libraries) {
    const errorHunter = libraries.logform.format(info => {
      if (info.error) return info;

      const splat = info[libraries.tripleBeam.SPLAT] || [];
      info.error = splat.find(obj => obj instanceof Error);

      return info;
    });

    const errorPrinter = libraries.logform.format(info => {
      if (!info.error) return info;

      // Handle case where Error has no stack.
      const errorMsg = info.error.stack || info.error.toString();
      info.message += `\n${errorMsg}`;

      return info;
    });

    const winstonConsoleFormat = libraries.logform.format.combine(
      libraries.logform.format.timestamp(),
      errorHunter(),
      errorPrinter(),
      libraries.logform.format.printf(info => `${info.timestamp} - ${info.level}: ${info.message}`)
    );

    const tps = [];
    let logLevel = 'debug';

    tps.push(new libraries.winston.transports.Console({
      format: winstonConsoleFormat,
    }));

    if (config !== undefined && config.logger !== undefined) {
      let filePath = config.logger.filePath;
      logLevel = config.logger.level;

      if (filePath != null && filePath != '') {
        tps.push(new libraries.winston.transports.File({
          format: winstonConsoleFormat,
          filename: filePath
        }));
      }
    }

    this.__logger = libraries.winston.createLogger({
      transports: tps,
      level: logLevel
    });
  }

  info(msg) {
    this.__logger.info(msg);
  };

  debug(msg) {
    this.__logger.debug(msg);
  };

  warn(msg) {
    this.__logger.warn(msg);
  };

  error(msg, error) {
    this.__logger.error(msg, error);
  };

  setLevel(level) {
    this.__logger.level = level;
  };
}
