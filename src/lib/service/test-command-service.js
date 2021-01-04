export default class TestCommandService {
  /**
   * @type {Logger}
   */
  #logger = void 0;

  /**
   * @type {typeof import("../config").default}
   */
  #config = void 0;

  /**
   * @type {{
   *  command: import("./command-service").default
   * }}
   */
  #services = {};

  /**
   * @type {{
   *  command: typeof import("../util/command")
   * }}
   */
  #utils = {};

  /**
   * 
   * @param {Logger} logger 
   * @param {typeof import("../config").default} config 
   * @param {import("./command-service").default} commandService 
   * @param {typeof import("../util/command")} commandUtil 
   */
  constructor(logger, config, commandService, commandUtil) {
    this.#logger = logger;
    this.#config = config;
    this.#services.command = commandService;
    this.#utils.command = commandUtil;

    this.init();
  }

  /**
   * @private
   */
  init() {
    this.#services.command.register(
      new this.#utils.command.ChainableCommand()
        .withName("test")
        .withArgs([
          String,
          Boolean
        ])
        .withCallback(async (ctx, ...args) => {
          await ctx.channel.send(JSON.stringify(args, null, 2));
        })
    )
  }
}
