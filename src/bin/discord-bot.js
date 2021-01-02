#!/usr/bin/env node

import path from "path"
import program from 'commander'
import DiscordBot from ".."
import { config } from "dotenv"
config()

const pkg = require('../../package.json');

program
    .version(pkg.version)
    .option('-c, --config [string]', 'Config path')
    .parse(process.argv);

const configPath = program.config || path.resolve(__dirname, '..', 'lib', 'config');

(async () => {
  try {
    const server = await DiscordBot.createServer(configPath);

    const terminate = async () => {
      try {
        await server.stop();
        process.exit(0);
      } catch(err) {
        console.error(err);
        process.exit(1);
      }
    };

    process.on('SIGINT', terminate);
    process.on('SIGTERM', terminate);
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
})();
