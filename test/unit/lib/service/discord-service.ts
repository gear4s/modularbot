import DiscordService from "../../../../src/lib/service/discord-service";

describe(testName(module), () => {
  beforeEach(function () {
    this.mockLogger = {
      debug: sinon.stub(),
    };

    this.mockConfig = {
      bot: {
        token: "1234",
      },
    };

    this.mockDiscordClient = {
      on: sinon.stub(),
      login: sinon.stub(),
      destroy: sinon.stub(),
      user: {
        tag: 1234,
      },
    };

    this.mockLibraries = {
      discord: {
        Client: sinon.stub().returns(this.mockDiscordClient),
      },
    };
  });

  it("should create an instance of the discord service", function () {
    new DiscordService(this.mockLogger, this.mockConfig, this.mockLibraries);

    expect(this.mockLibraries.discord.Client).to.have.been.calledWithNew;
    expect(this.mockDiscordClient.on).to.have.been.calledWithExactly(
      "ready",
      sinon.match.func
    );
  });

  it("should handle ready states", function () {
    new DiscordService(this.mockLogger, this.mockConfig, this.mockLibraries);

    expect(this.mockLibraries.discord.Client).to.have.been.calledWithNew;
    expect(this.mockDiscordClient.on).to.have.been.calledWithExactly(
      "ready",
      sinon.match.func
    );
    this.mockDiscordClient.on.getCall(0).lastArg();
    expect(this.mockLogger.debug).to.have.been.calledWithExactly(
      `Logged in as ${this.mockDiscordClient.user.tag}!`
    );
  });

  it("should return a new Discord instance", function () {
    const svc = new DiscordService(
      this.mockLogger,
      this.mockConfig,
      this.mockLibraries
    );
    const discordApp = svc.app;

    expect(this.mockLibraries.discord.Client).to.have.been.calledWithNew;
    expect(discordApp).to.deep.equal(this.mockDiscordClient);
  });

  it("should handle starting the service", async function () {
    const svc = new DiscordService(
      this.mockLogger,
      this.mockConfig,
      this.mockLibraries
    );
    await svc.start();

    expect(this.mockDiscordClient.login).to.have.been.calledOnce;
  });

  it("should handle stopping the service", function () {
    const svc = new DiscordService(
      this.mockLogger,
      this.mockConfig,
      this.mockLibraries
    );
    svc.stop();

    expect(this.mockDiscordClient.destroy).to.have.been.calledOnce;
  });
});
