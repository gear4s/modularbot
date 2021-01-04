import path from "path";

export default {
  bot: {
    token: process.env.BOT_TOKEN || "",
    prefix: process.env.BOT_PREFIX || ""
  },
  commands: {
    directory: process.env.COMMAND_DIRECTORY || path.resolve(__dirname, "..", "commands")
  }
}
