import { createNewPyGgbFile, optsNoIsolation } from "./shared";

describe("runs provided examples", optsNoIsolation, () => {
  before(createNewPyGgbFile);
});
