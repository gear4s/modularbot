import chai from 'chai'
import sinonChai from "sinon-chai"

chai.use(sinonChai);

global.testName = module => {
  const split = module.filename.split("/");
  const spliced = split.splice(split.indexOf("test") + 3, split.length);
  return ["lib", ...spliced].join("/");
}
