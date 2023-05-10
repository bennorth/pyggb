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

  specs.forEach((spec) => {
    it(`runs example "${spec.filename}"`, () => {
      if (spec.skip ?? false) {
        return;
      }

      cy.fixture(`examples/${spec.filename}`, "utf-8").then((code) => {
        cy.window().then((window) => {
          window["PYGGB_CYPRESS"]["ZERO_DELAY"] = true;
          const fullCode = code + '\n\nprint("done")';
          window["PYGGB_CYPRESS"].ACE_EDITOR.setValue(fullCode);
          cy.get("button").contains("RUN").click();
          if (spec.expDoneOutput ?? true) {
            cy.get(".stdout-inner").contains("done");
          }
          (spec.expOutputs ?? []).forEach((expOutput) =>
            cy.get(".stdout-inner").contains(`${expOutput}\n`)
          );
        });
      });
    });
  });
});
