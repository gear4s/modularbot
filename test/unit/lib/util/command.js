import { ChainableCommand } from "~/src/lib/util/command"

describe(testName(module), () => {
  it("should create a command object by chaining", () => {
    const cmd = new ChainableCommand()
      .withName("test name")
      .withArgs(["arg", "list"])
      .withDesc("test desc")
      .withCb(() => {})
    
    const jcmd = cmd.toJSON();

    expect(jcmd).to.have.property("name").which.equals("test name");
    expect(jcmd).to.have.property("args").which.includes.members(["arg", "list"]);
    expect(jcmd).to.have.property("description").which.equals("test desc");
    expect(jcmd).to.have.property("callback").which.is.a("function");
  });

  it("should create a command object by constructing", () => {
    const cmd = new ChainableCommand({
      name: "test name",
      args: ["arg", "list"],
      description: "test desc",
      callback: () => {}
    })

    const jcmd = cmd.toJSON();

    expect(jcmd).to.have.property("name").which.equals("test name");
    expect(jcmd).to.have.property("args").which.includes.members(["arg", "list"]);
    expect(jcmd).to.have.property("description").which.equals("test desc");
    expect(jcmd).to.have.property("callback").which.is.a("function");
  });
});
