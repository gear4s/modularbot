import type { Libraries } from "~/container"
import type LoggerType from "../logger"
import type Config from "../config"
import type * as CommandUtil from "../util/command"
import type * as Axios from "axios"
import type Discord from "discord.js"
import type ContextUtil from "../util/context"

export default class TestCommandService {
  #watching: string[] = [];
  #logger: LoggerType = void 0;
  #config: typeof Config = void 0;
  #services: { command: any } = {
    command: null
  };
  #utils: { command: typeof CommandUtil} = {
    command: null
  };
  #axios: Axios.AxiosStatic;
  #discord: typeof Discord;
  #helix: Axios.AxiosInstance;

  constructor(logger: LoggerType, config: typeof Config, libraries: Libraries, commandService, commandUtil) {
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
      `https://id.twitch.tv/oauth2/token?client_id=${this.#config.twitch.publicKey}&client_secret=${this.#config.twitch.secretKey}&grant_type=client_credentials`
    )

    this.#helix = this.#axios.create({
      baseURL: 'https://api.twitch.tv/helix/',
      headers: {
        'Client-ID': this.#config.twitch.publicKey,
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

    this.#services.command.register(
      new this.#utils.command.ChainableCommand()
        .withCallback(this.watchForStreamerToBeLive)
        .withName("watch")
        .withArgs([
          String,
          this.#discord.TextChannel
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

  watchForStreamerToBeLive = async (ctx: ContextUtil, streamerName: string, channel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel) => {
    !channel && (channel = ctx.channel);

    if(streamerName === "") {
      return await ctx.send("I need a streamer name! `!live <streamerName>`")
    }

    this.#watching.push(streamerName);
    await channel.send("Added " + streamerName + " to the streamer watch list")
  }

  watch = () => {
    // AFK here for now
    // if(streamerNames === "") {
    //   return await ctx.send("I need at least one streamer name! `!live <...streamerNames>`")
    // }

    // streamerNames = streamerNames.split(" ").map(name => "user_login="+name).join("&");

    // const res = await this.#helix(`streams?${streamerNames}`);
  }
}
