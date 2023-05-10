import { createNewPyGgbFile, optsNoIsolation } from "./shared";

describe("runs provided examples", optsNoIsolation, () => {
  before(createNewPyGgbFile);

  type SampleCodeSpec = {
    filename: string;
    skip?: boolean;
    expDoneOutput?: boolean;
    expOutputs?: Array<string>;
  };

  const specs: Array<SampleCodeSpec> = [
    // TODO
  ];
});
