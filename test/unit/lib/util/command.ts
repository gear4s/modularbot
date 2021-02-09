import { ChainableCommand } from "../../../../src/lib/util/command";
import InvalidArgType from "../../../../src/lib/errors/command-invalid-argument-type-error";

describe(testName(module), () => {
  it("should create a command object by chaining", () => {
    const cmd = new ChainableCommand()
      .withName("test name")
      .withArgs([Number, Boolean])
      .withDesc("test desc")
      .withCb(() => {});

    const jcmd = cmd.toJSON();

    expect(jcmd).to.have.property("name").which.equals("test name");
    expect(jcmd)
      .to.have.property("args")
      .which.includes.members([Number, Boolean]);
    expect(jcmd).to.have.property("description").which.equals("test desc");
    expect(jcmd).to.have.property("callback").which.is.a("function");
  });

  it("should create a command object by constructing", () => {
    const cmd = new ChainableCommand({
      name: "test name",
      args: [Number, Boolean],
      description: "test desc",
      callback: () => {},
    });

    const jcmd = cmd.toJSON();

    expect(jcmd).to.have.property("name").which.equals("test name");
    expect(jcmd)
      .to.have.property("args")
      .which.includes.members([Number, Boolean]);
    expect(jcmd).to.have.property("description").which.equals("test desc");
    expect(jcmd).to.have.property("callback").which.is.a("function");
  });

  it("should fail to create a command object by constructing: 'args' not array", () => {
    let failed = false;
    try {
      new ChainableCommand({
        name: "test name",
        // @ts-ignore
        args: "failure",
        description: "test desc",
        callback: () => {},
      });
    } catch (e) {
      failed = true;
      expect(e).to.be.an.instanceOf(Error);
      expect(e.message).to.equal("Args have to be an array of types");
    }

    if (!failed) {
      throw new Error("Should have failed!");
    }
  });

  it("should fail to create a command object by constructing: invalid arg type", () => {
    let failed = false;
    try {
      new ChainableCommand({
        name: "test name",
        // @ts-ignore
        args: ["arg"],
        description: "test desc",
        callback: () => {},
      });
    } catch (e) {
      failed = true;
      expect(e).to.be.an.instanceOf(InvalidArgType);
      expect(e.message).to.equal("arg");
    }

    if (!failed) {
      throw new Error("Should have failed!");
    }
  });
});
