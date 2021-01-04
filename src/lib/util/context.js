export default class ContextUtil {
  /**
   * @type {import("./string").default}
   */
  #view = null;

  /**
   * @type {import("discord.js").Client}
   */
  bot = null;

  /**
   * @type {{
   *  name: null,
   *  args: null,
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
   * @param {import("discord.js").Client} bot 
   * @param {String} prefix 
   * @param {import("./string").default} view 
   * @param {import("discord.js").Message} msg 
   */
  constructor(bot, prefix, view, msg) {
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

  async invoke() {
    await this.command.callback(this, this.#view.readRest());
  }
}
