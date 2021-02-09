/* eslint-disable no-unused-vars */
import type { SinonStatic } from "sinon";
import type Chai from "chai";
import type SinonChai from "sinon-chai";

declare global {
  function testName(module: NodeJS.Module): string;
  const expect: Chai.ExpectStatic;
  const sinon: SinonStatic;
}
