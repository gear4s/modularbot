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
   * @type {import("axios").default}
   */
  #axios = void 0;

  /**
   * @type {import("discord.js")}
   */
  #discord = void 0;

  /**
   * @type {import("axios").AxiosInstance}
   */
  #helix = void 0;

  /**
   * 
   * @param {Logger} logger 
   * @param {typeof import("../config").default} config 
   * @param {{
   *  discord: import("discord.js"),
   *  mongoose: import("mongoose"),
   *  fs: import("fs"),
   *  path: import("path"),
   *  logform: import('logform'),
   *  tripleBeam: import('triple-beam'),
   *  winston: import('winston'),
   *  axios: import("axios").default
   * }} libraries
   * @param {import("./command-service").default} commandService 
   * @param {typeof import("../util/command")} commandUtil 
   */
  constructor(logger, config, libraries, commandService, commandUtil) {
    this.#logger = logger;
    this.#config = config;
    this.#services.command = commandService;
    this.#utils.command = commandUtil;
    this.#axios = libraries.axios;
    this.#discord = libraries.discord;

    this.init();
  }

  /**
   * @private
   */
  async init() {
    const twitchResponse = await this.#axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=tn16ksbrgz705jxu305iex8rsztn63&client_secret=lys7a0kf2cqj9a08c6t25fy4857eqx&grant_type=client_credentials`
    )

    this.#helix = this.#axios.create({
      baseURL: 'https://api.twitch.tv/helix/',
      headers: {
        'Client-ID': "tn16ksbrgz705jxu305iex8rsztn63",
        "Authorization": "Bearer " + twitchResponse.data.access_token
      }
    });

    this.#services.command.register(
      new this.#utils.command.ChainableCommand()
        .withCallback(this.checkIfStreamerIsLive)
        .withName("live")
        .withArgs([
          String
        ])
    )
  }

  /**
   * @param {import("~/../types").Context} ctx 
   * @param {String} streamerName 
   * @returns {Promise<void>}
   */
  checkIfStreamerIsLive = async (ctx, streamerName) => {
    if(streamerName === "") {
      return await ctx.send("I need a streamer name! `!live <streamerName>`")
    }

    const { data: { data: [streamer] } } = await this.#helix(`streams?user_login=${streamerName}`);
    const { data: { data: [channelData] } } = await this.#helix(`users?login=${streamerName}`);

    const embed = new this.#discord.MessageEmbed()

    if(streamer !== undefined) {
      embed.setTitle(streamer.user_name + " is live!");
      embed.setThumbnail(channelData.profile_image_url);
      embed.setDescription("Playing" + streamer.game_name);
      embed.setImage(streamer.thumbnail_url.replace(/\{width\}/g, "960").replace(/\{height\}/g, "540"));
      embed.setURL("https://twitch.tv/" + streamerName);
    }

    await ctx.send({
      embed
    });
  }

  watch = async () => {
    // AFK here for now
    // if(streamerNames === "") {
    //   return await ctx.send("I need at least one streamer name! `!live <...streamerNames>`")
    // }

    // streamerNames = streamerNames.split(" ").map(name => "user_login="+name).join("&");

    // const res = await this.#helix(`streams?${streamerNames}`);
  }
}
