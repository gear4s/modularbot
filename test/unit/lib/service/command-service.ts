import CommandService from "../../../../src/lib/service/command-service";
import { ChainableCommand } from "../../../../src/lib/util/command";

describe(testName(module), () => {
  beforeEach(function () {
    this.mockLogger = {
      debug: sinon.stub(),
    };

    this.mockConfig = {
      bot: {
        token: "1234",
        prefix: "1,2,2\\,5,3\\,75,\\,,!",
      },
    };

    this.mockLibraries = {
      boolean: sinon.stub().returns(true),
    };

    this.mockDiscordService = {
      app: {
        on: sinon.stub(),
      },
    };

    this.mockStringUtil = class MockStringUtil {};

    this.mockContextUtil = class MockContextUtil {
      bot = null;
      command = null;
      prefix = null;
      invokedWith = null;
      msg = null;
    };

    this.mockCommandUtil = {
      ChainableCommand,
    };
  });

  it("should create an instance of the command service", function () {
    new CommandService(
      this.mockLogger,
      this.mockConfig,
      this.mockLibraries,
      this.mockDiscordService,
      this.mockStringUtil,
      this.mockContextUtil,
      this.mockCommandUtil
    );

    expect(this.mockDiscordService.app.on).to.have.been.calledWithExactly(
      "message",
      sinon.match.func
    );
  });

  it("should handle the message event: bot user", async function () {
    const svc = new CommandService(
      this.mockLogger,
      this.mockConfig,
      this.mockLibraries,
      this.mockDiscordService,
      this.mockStringUtil,
      this.mockContextUtil,
      this.mockCommandUtil
    );
    const getCtxStub = sinon.stub(svc, "getContext");

    await this.mockDiscordService.app.on.getCall(0).lastArg({
      author: {
        bot: true,
      },
    });

    expect(getCtxStub).to.not.have.been.called;
  });

  it("should handle the message event: invalid context", async function () {
    const svc = new CommandService(
      this.mockLogger,
      this.mockConfig,
      this.mockLibraries,
      this.mockDiscordService,
      this.mockStringUtil,
      this.mockContextUtil,
      this.mockCommandUtil
    );

    const mockContext = {
      valid: false,
      invoke: sinon.stub(),
    };

    // @ts-ignore
    const getCtxStub = sinon.stub(svc, "getContext").returns(mockContext);

    await this.mockDiscordService.app.on.getCall(0).lastArg({
      author: {
        bot: false,
      },
    });

    expect(getCtxStub).to.have.been.calledOnceWithExactly({
      author: {
        bot: false,
      },
    });

    expect(mockContext.invoke).to.not.have.been.called;
  });

  it("should handle the message event: valid context", async function () {
    const svc = new CommandService(
      this.mockLogger,
      this.mockConfig,
      this.mockLibraries,
      this.mockDiscordService,
      this.mockStringUtil,
      this.mockContextUtil,
      this.mockCommandUtil
    );

    const mockContext = {
      valid: true,
      invoke: sinon.stub(),
    };

    // @ts-ignore
    const getCtxStub = sinon.stub(svc, "getContext").returns(mockContext);

    await this.mockDiscordService.app.on.getCall(0).lastArg({
      author: {
        bot: false,
      },
    });

    expect(getCtxStub).to.have.been.calledOnceWithExactly({
      author: {
        bot: false,
      },
    });

    expect(mockContext.invoke).to.have.been.calledOnce;
  });

  it("should separate prefixes into an array", async function () {
    const svc = new CommandService(
      this.mockLogger,
      this.mockConfig,
      this.mockLibraries,
      this.mockDiscordService,
      this.mockStringUtil,
      this.mockContextUtil,
      this.mockCommandUtil
    );

    // @ts-ignore
    expect(svc.prefix).to.include.members(["1", "2", "2,5", "3,75", ",", "!"]);
  });

  it("should fail to register command without command type", async function () {
    const svc = new CommandService(
      this.mockLogger,
      this.mockConfig,
      this.mockLibraries,
      this.mockDiscordService,
      this.mockStringUtil,
      this.mockContextUtil,
      this.mockCommandUtil
    );

    try {
      // @ts-ignore
      svc.register();
    } catch (e) {
      expect(e)
        .to.have.property("message")
        .which.equals(
          "Command must be an object of the Chainable Command class"
        );
    }
  });

  it("should register a new command", async function () {
    const svc = new CommandService(
      this.mockLogger,
      this.mockConfig,
      this.mockLibraries,
      this.mockDiscordService,
      this.mockStringUtil,
      this.mockContextUtil,
      this.mockCommandUtil
    );

    svc.register(new ChainableCommand().withName("test1"));
  });

  it("should fail to register a duplicate command", async function () {
    const svc = new CommandService(
      this.mockLogger,
      this.mockConfig,
      this.mockLibraries,
      this.mockDiscordService,
      this.mockStringUtil,
      this.mockContextUtil,
      this.mockCommandUtil
    );

    try {
      svc.register(new ChainableCommand().withName("test1"));
      svc.register(new ChainableCommand().withName("test1"));
    } catch (e) {
      expect(e)
        .to.have.property("message")
        .which.equals("Command `test1` already exists");
    }
  });

  it("should throw an error relating to prefix containing strings", async function () {
    const svc = new CommandService(
      this.mockLogger,
      this.mockConfig,
      this.mockLibraries,
      this.mockDiscordService,
      this.mockStringUtil,
      this.mockContextUtil,
      this.mockCommandUtil
    );

    try {
      // @ts-ignore
      svc.getContext({});
    } catch (e) {
      expect(e)
        .to.have.property("message")
        .which.equals(
          "Iterable `defaultPrefix` or list returned from `prefix` must contain only strings"
        );
    }
  });

  it("should return an incomplete context", async function () {
    const svc = new CommandService(
      this.mockLogger,
      this.mockConfig,
      this.mockLibraries,
      this.mockDiscordService,
      this.mockStringUtil,
      this.mockContextUtil,
      this.mockCommandUtil
    );

    // @ts-ignore
    const incCtx = svc.getContext({
      content: "xyz",
    });

    expect(incCtx).to.have.property("invokedWith").which.is.null;
    expect(incCtx).to.have.property("prefix").which.is.null;
    expect(incCtx).to.have.property("command").which.is.null;
  });

  it("should return a complete context with an invalid command", async function () {
    const svc = new CommandService(
      this.mockLogger,
      this.mockConfig,
      this.mockLibraries,
      this.mockDiscordService,
      this.mockStringUtil,
      this.mockContextUtil,
      this.mockCommandUtil
    );

    this.mockStringUtil.prototype.skipString = sinon
      .stub()
      .callsFake((prefix) => prefix === "!");
    this.mockStringUtil.prototype.getWord = sinon.stub().returns("hi");

    // @ts-ignore
    const incCtx = svc.getContext({
      content: "!xyz",
    });

    expect(incCtx).to.have.property("invokedWith").which.equals("hi");
    expect(incCtx).to.have.property("prefix").which.equals("!");
    expect(incCtx).to.have.property("command").which.is.null;
  });

  it("should return a complete context with a valid command", async function () {
    const svc = new CommandService(
      this.mockLogger,
      this.mockConfig,
      this.mockLibraries,
      this.mockDiscordService,
      this.mockStringUtil,
      this.mockContextUtil,
      this.mockCommandUtil
    );

    svc.register(
      new ChainableCommand()
        .withName("test1")
        .withDesc("testing desc")
        .withArgs([Number, Boolean])
    );

    this.mockStringUtil.prototype.skipString = sinon
      .stub()
      .callsFake((prefix) => prefix === "!");
    this.mockStringUtil.prototype.getWord = sinon.stub().returns("test1");

    // @ts-ignore
    const incCtx = svc.getContext({
      content: "!test1",
    });

    expect(incCtx).to.have.property("invokedWith").which.equals("test1");
    expect(incCtx).to.have.property("prefix").which.equals("!");
    expect(incCtx)
      .to.have.property("command")
      .which.deep.equals({
        name: "test1",
        args: [Number, Boolean],
        description: "testing desc",
        callback: null,
      });
  });
});
