import StringUtil from "~/src/lib/util/string"

describe(testName(module), () => {
  it("should work with the provided string", () => {
    const str = "    !hello \"world views\""
    const strut = new StringUtil(str);

    // skip over white space
    expect(strut.skipWs()).to.be.true;

    // skip over the ! and get the word "hello"
    expect(strut.skipString("!")).to.be.true;
    expect(strut.getWord()).to.equal("hello");

    // skip over the space after "hello", and try to skip over non-existing characters
    expect(strut.skipString(" ")).to.be.true;
    expect(strut.skipString("?")).to.be.false;
    expect(strut.skipWs()).to.be.false;

    // get the quoted words "world views"
    expect(strut.getQuotedWord()).to.equal("world views");

    // at the end of the string; eof should be true, current should be null
    expect(strut.eof).to.be.true;
    expect(strut.current).to.be.null;

    // undo the last action (clear the last quote)
    strut.undo();
    expect(strut.current).to.equal("\"");

    // skip over the last quote
    expect(strut.skipString("\"")).to.be.true;

    // at the end of the string; eof should be true, current should be null
    expect(strut.eof).to.be.true;
    expect(strut.current).to.be.null;

    // reset the string util's position
    strut.reset();

    // read the entire string
    expect(strut.readRest()).to.equal(str);

    // getQuotedWord should return null if current is null
    expect(strut.getQuotedWord()).to.be.null;

    // reset the string util's position
    strut.reset();

    // skip over white space
    expect(strut.skipWs()).to.be.true;

    // skip over the ! and get the word "hello"
    expect(strut.skipString("!hello")).to.be.true;

    try {
      strut.getQuotedWord();
      throw new Error("This should not have passed");
    } catch(e) {
      // it should throw an unexpected quote error
      expect(e).to.have.property("message").which.equals("Unexpected quote: \"")
    }
  });
});
