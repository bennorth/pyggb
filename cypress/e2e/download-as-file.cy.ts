import path = require("path");
import {
  createNewPyGgbFile,
  deIndent,
  optsNoIsolation,
  runCode,
} from "./shared";

describe("download as file", optsNoIsolation, () => {
  const code = deIndent(`
    p1 = Point(2, 1)
    p2 = Point(7, 3)
    s = Segment(p1, p2)
  `);

  before(() => {
    createNewPyGgbFile();
    cy.window().then((window) => {
      window["PYGGB_CYPRESS"].ACE_EDITOR.setValue(code);
    });
    runCode();
  });

  const downloadsFolder = Cypress.config("downloadsFolder");

  const downloadWithName = (basename: string) => {
    cy.get("input").type(`{selectAll}${basename}`);
    cy.get("button").contains("Download").click();
    return cy.readFile(path.join(downloadsFolder, basename));
  };
});
