import { v4 as uuidv4 } from "uuid";

describe("Runs Python programs", () => {
  const chooseFileMenuEntry = (entryMatch: string) => {
    cy.get(".MenuBar .nav-link", { timeout: 10000 }).contains("File").click();
    cy.get(".dropdown-item").contains(entryMatch).click();
  };

  before(() => {
    cy.visit("/");
  });

  beforeEach(() => {
    const filename = uuidv4();

    chooseFileMenuEntry("New");
    cy.get(".modal-body input").click().type(filename);
    cy.get("button").contains("Create").click();
    cy.get(".editor .busy-overlay").should("not.be.visible");
    cy.get(".MenuBar").contains(filename);
  });
});
