/* eslint-disable no-unused-vars */
import type * as Winston from "winston";
import type { Libraries } from "../container";
import type Config from "./config";
/* eslint-enable no-unused-vars */

export default class Logger {
  private logger: Winston.Logger;

  constructor(config: typeof Config, libraries: Libraries) {
    const errorHunter = libraries.logform.format((info) => {
      if (info.error) return info;

      // @ts-ignore
      const splat = info[libraries.tripleBeam.SPLAT] || [];
      info.error = splat.find((obj: any) => obj instanceof Error);

      return info;
    });

    const errorPrinter = libraries.logform.format((info) => {
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
      libraries.logform.format.printf(
        (info) => `${info.timestamp} - ${info.level}: ${info.message}`
      )
    );

    const tps = [];
    let logLevel = "info";

    tps.push(
      new libraries.winston.transports.Console({
        format: winstonConsoleFormat,
      })
    );

    if (config !== undefined && config.logger !== undefined) {
      let filePath = config.logger.filePath;
      logLevel = config.logger.level;

      if (filePath) {
        tps.push(
          new libraries.winston.transports.File({
            format: winstonConsoleFormat,
            filename: filePath,
          })
        );
      }
    }

    this.logger = libraries.winston.createLogger({
      transports: tps,
      level: logLevel,
    });
  }

  info(msg: string) {
    this.logger.info(msg);
  }

  debug(msg: string) {
    this.logger.debug(msg);
  }

  warn(msg: string) {
    this.logger.warn(msg);
  }

  error(msg: string, error?: Error) {
    this.logger.error(msg, error);
  }

  setLevel(level: string) {
    this.logger.level = level;
  }
}
