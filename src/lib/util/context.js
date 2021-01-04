import InvalidArgumentError from "../errors/command-invalid-argument-error"

export default class ContextUtil {
  /**
   * @type {import("./string").default}
   */
  #view = null;

  /**
   * @type {(value: any) => boolean}
   */
  #boolean = void 0;

  /**
   * @type {import("discord.js").Client}
   */
  bot = null;

  /**
   * @type {{
   *  name: null,
   *  args: Array | null,
   *  description: null,
   *  callback: (ctx, ...args) => void
   * }}
   */
  command = null;
  
  /**
   * @type {String}
   */
  prefix = null;
  
  /**
   * @type {String}
   */
  invokedWith = null;
  
  /**
   * @type {import("discord.js").Message}
   */
  msg = null;

  /**
   * 
   * @param {(value: any) => boolean} boolean 
   * @param {import("discord.js").Client} bot 
   * @param {String} prefix 
   * @param {import("./string").default} view 
   * @param {import("discord.js").Message} msg 
   */
  constructor(boolean, bot, prefix, view, msg) {
    this.#boolean = boolean;
    this.bot = bot;
    this.prefix = prefix;
    this.invokedWith = null;
    this.#view = view;
    this.msg = msg;
    this.command = null;
  }

  get valid() {
    return this.prefix !== null && this.command !== null;
  }

  get guild() {
    return this.msg.channel.guild;
  }

  get channel() {
    return this.msg.channel;
  }

  get author() {
    return this.msg.author;
  }

  get me() {
    return this.bot.user;
  }

  /**
   * @private
   */
  get args() {
    const args = this.command.args;
    const mappedArgs = [];

    for(const arg of args) {
      this.#view.skipWs();
      
      if(arg === true && args.indexOf(arg) === args.length - 1) {
        // last arg must be "true" to capture the rest of the uncaptured string
        mappedArgs.push(this.#view.readRest());
        break;
      }

      if(arg === String) {
        mappedArgs.push(this.#view.getWord())
      } else if(arg === Number) {
        const word = this.#view.getWord();

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
        mappedArgs.push(this.#boolean(this.#view.getWord()));
      }
    }

    return mappedArgs;
  }

  async invoke() {
    await this.command.callback(this, ...this.args);
  }
}
