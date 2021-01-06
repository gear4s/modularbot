import InvalidArgumentError from "../errors/command-invalid-argument-error"
import type StringView from "./string"
import type { CommandObject } from "./command"
import type { Client as ClientType, Message as MessageType } from "discord.js"
import type { boolean as BooleanType } from "boolean"
import type Discord from "discord.js"

const ChannelRe = /<#(.+)>/

export default class ContextUtil {
  private view: StringView = null;
  private boolean: typeof BooleanType = void 0;
  private discord: typeof Discord = null;
  bot: ClientType = null;
  command: CommandObject = null;
  prefix: string = null;
  invokedWith: string = null;
  msg: MessageType = null;

  constructor(
    discord: typeof Discord, boolean: typeof BooleanType, bot: ClientType, prefix: string, view: StringView, msg: MessageType
  ) {
    this.discord = discord;
    this.boolean = boolean;
    this.bot = bot;
    this.prefix = prefix;
    this.invokedWith = null;
    this.view = view;
    this.msg = msg;
    this.command = null;
  }

  get valid() {
    return this.prefix !== null && this.command !== null;
  }

  get guild() {
    return this.msg.guild;
  }

  get channel() {
    return this.msg.channel;
  }

  get author() {
    return this.msg.author;
  }

  get me() {
    this.send()
    return this.bot.user;
  }

  get send() {
    return this.msg.channel.send.bind(this.msg.channel);
  }

  /**
   * @private
   */
  async args() {
    const args = this.command.args;
    const mappedArgs = [];

    for(const arg of args) {
      this.view.skipWs();

      if(arg === true && args.indexOf(arg) === args.length - 1) {
        // last arg must be "true" to capture the rest of the uncaptured string
        mappedArgs.push(this.view.readRest());
        break;
      }

      if(arg === String) {
        mappedArgs.push(this.view.getWord())
      } else if(arg === Number) {
        const word = this.view.getWord();

        let number = parseFloat(word);

        if(isNaN(number)) {
          number = parseInt(word);
        }

        if(isNaN(number)) {
          // should fail at this point
          throw new InvalidArgumentError(`Argument is not a number: ${word}`, this);
        }

        mappedArgs.push(number);
      } else if(arg === Boolean) {
        mappedArgs.push(this.boolean(this.view.getWord()));
      } else if(
        // @ts-ignore
        arg.prototype instanceof this.discord.Channel
      ) {
        const match = this.view.getWord().match(ChannelRe);
        if(match) {
          const channelId = match[1];
          const channel = await this.bot.channels.fetch(channelId, true)
          mappedArgs.push(channel);
        } else mappedArgs.push(null); // invalid channel will always be null
      }
    }

    return mappedArgs;
  }

  async invoke() {
    await this.command.callback(this, ...await this.args());
  }
}
