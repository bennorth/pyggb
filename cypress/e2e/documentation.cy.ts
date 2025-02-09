import { createNewPyGgbFile, optsNoIsolation } from "./shared";

describe("documentation", optsNoIsolation, () => {
  before(() => {
    createNewPyGgbFile();
  });

  it("can open documentation", () => {
    cy.get(".link-to-docs a")
      .invoke("removeAttr", "target") // force same tab
      .click();
    cy.get("li.toctree-l1").contains("The PyGgb webapp");
  });
});
