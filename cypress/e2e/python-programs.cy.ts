import { v4 as uuidv4 } from "uuid";

class ConstructionVerificationState {
  // List of things we expect to see, in an order which lets us refer back to
  // points when describing lines, say.
}

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

/**
 * How to specify what should happen as the result of running a program under
 * test?  Want to say that certain points (with particular properties, such as
 * coords, colors, sizes) exist.  And that other things (line, segments) also
 * exist, to include certain of those points.
 *
 * Want to test all the construction facilities.
 *
 * ExpectPoint(x, y, props, labelToAssign)
 *
 * ExpectLine(pointLabel_1, pointLabel_2)  // Points can be in either order
 *
 * ExpectPolygon(list-of-points, props)  // Points can be cyclically permuted
 *
 * ExpectCircle(centre, radius)  // Can get at radius via Radius().
 *
 * Want to avoid duplicating code between skulpt-ggb.js and test code.  Might be
 * unable to avoid all duplication since here we don't want to worry about
 * Python objects.
 */
