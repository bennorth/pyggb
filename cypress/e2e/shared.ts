import { v4 as uuidv4 } from "uuid";

export const optsNoIsolation = { testIsolation: false };

export const chooseFileMenuEntry = (entryMatch: string) => {
  cy.get(".MenuBar .nav-link", { timeout: 10000 }).contains("File").click();
  cy.get(".dropdown-item").contains(entryMatch).click();
};

export const createNewPyGgbFile = (filename?: string) => {
  cy.visit("/");
  const effectiveFilename = filename ?? uuidv4();

  chooseFileMenuEntry("New");
  cy.get(".modal-body input").click().type(effectiveFilename);
  cy.get("button").contains("Create").click();
  cy.get(".editor .busy-overlay").should("not.be.visible");
  cy.get(".MenuBar").contains(effectiveFilename);
};
