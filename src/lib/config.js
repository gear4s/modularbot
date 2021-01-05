import path from "path";

export default {
  bot: {
    token: process.env.BOT_TOKEN || "",
    prefix: process.env.BOT_PREFIX || ""
  },
  commands: {
    directory: process.env.COMMAND_DIRECTORY || path.resolve(__dirname, "..", "commands")
  },
  twitch: {
    publicKey: process.env.TWITCH_PUBKEY || false,
    secretKey: process.env.TWITCH_PRVKEY || false
  }
}
