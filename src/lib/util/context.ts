import InvalidArgumentError from "../errors/command-invalid-argument-error";

/* eslint-disable no-unused-vars */
import type StringView from "./string";
import type { CommandObject, ValidCommandArguments } from "./command";
import type Discord from "discord.js";

import type { boolean as BooleanType } from "boolean";
/* eslint-enable no-unused-vars */

const MentionRE = /<(?:#|@!?)(.+)>/;

export default class ContextUtil {
  private view: StringView = null;
  private boolean: typeof BooleanType = void 0;
  private discord: typeof Discord = null;
  bot: Discord.Client = null;
  command: CommandObject = null;
  prefix: string = null;
  invokedWith: string = null;
  msg: Discord.Message = null;

  constructor(
    discord: typeof Discord,
    boolean: typeof BooleanType,
    bot: Discord.Client,
    prefix: string,
    view: StringView,
    msg: Discord.Message
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

  get valid(): boolean {
    return this.prefix !== null && this.command !== null;
  }

  get guild(): Discord.Guild {
    return this.msg.guild;
  }

  get channel(): Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel {
    return this.msg.channel;
  }

  get author(): Discord.User {
    return this.msg.author;
  }

  get me(): Discord.ClientUser {
    return this.bot.user;
  }

  get send(): (
    | Discord.TextChannel
    | Discord.DMChannel
    | Discord.NewsChannel
  )["send"] {
    return this.msg.channel.send.bind(this.msg.channel);
  }

  private getSnowflakeFromStr(str: string): string {
    // first attempt: number
    if (!isNaN(Number(str))) {
      return str; // STR has to be ID only
    }

    const match = str.match(MentionRE);
    if (match) {
      return match[1];
    }

    return null;
  }

  private async args(): Promise<ValidCommandArguments[]> {
    const args = this.command.args;
    const mappedArgs = [];

    for (const arg of args) {
      this.view.skipWs(); // skip all white space

      let result: any = this.view.getWord();

      switch (arg) {
        /* eslint-disable no-fallthrough */
        case Boolean:
          result = this.boolean(result);

        case String:
          break;
        /* eslint-enable no-fallthrough */

        case Number:
          if (isNaN((result = Number(result).valueOf()))) {
            // should fail at this point
            throw new InvalidArgumentError(
              `Argument is not a number: ${result}`,
              this
            );
          }

          break;

        default: {
          // don't execute below if not a discord object
          if (
            // @ts-ignore
            !(arg.prototype instanceof this.discord.Base)
          )
            break;

          const snowflakeId = this.getSnowflakeFromStr(result);

          if (snowflakeId === null) {
            result = null; // invalid ID will always be null
            break;
          }

          switch (arg) {
            case this.discord.TextChannel:
            case this.discord.VoiceChannel:
            case this.discord.NewsChannel:
            case this.discord.StoreChannel:
              result = await this.bot.channels.fetch(snowflakeId, true);
              break;

            case this.discord.User:
              result = await this.bot.users.fetch(snowflakeId, true);
              break;

            default:
              throw new InvalidArgumentError(arg, this);
          }
        }
      }

      mappedArgs.push(result);
    }

    // capture everything after the last argument's type
    if (!this.view.eof) {
      this.view.skipWs();
      mappedArgs.push(this.view.readRest());
    }

    return mappedArgs;
  }

  async invoke(): Promise<void> {
    await this.command.callback(this, ...(await this.args()));
  }
}
