import { v4 as uuidv4 } from "uuid";

describe("Runs Python programs", () => {
  const chooseFileMenuEntry = (entryMatch: string) => {
    cy.get(".MenuBar .nav-link", { timeout: 10000 }).contains("File").click();
    cy.get(".dropdown-item").contains(entryMatch).click();
  };

  const allSpaces = new RegExp("^ *$");
  const initialSpaces = new RegExp("^ *");
  const deIndent = (rawCode: string): string => {
    const allLines = rawCode.split("\n");

    if (allLines[0] !== "") {
      throw Error("need empty first line of code");
    }
    const nLines = allLines.length;
    if (!allSpaces.test(allLines[nLines - 1])) {
      throw Error("need all-spaces last line of code");
    }

    const lines = allLines.slice(1, nLines - 1);

    const nonBlankLines = lines.filter((line) => !allSpaces.test(line));
    const nonBlankIndents = nonBlankLines.map(
      (line) => initialSpaces.exec(line)[0].length
    );
    const minNonBlankIndent = Math.min(...nonBlankIndents);

    const strippedLines = lines.map((line) =>
      line.substring(minNonBlankIndent)
    );
    return strippedLines.join("\n") + "\n";
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
