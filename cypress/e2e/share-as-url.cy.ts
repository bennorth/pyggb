import { v4 as uuidv4 } from "uuid";
import { chooseFileMenuEntry, createNewPyGgbFile, deIndent } from "./shared";

describe("Share as URL", () => {
  it("can create and use URL for project", () => {
    cy.visit("/");

    // Include some non-ASCII characters:
    const filename = `😀😀😀 ${uuidv4()}`;
    createNewPyGgbFile(filename);

    const code = `
      # Some non-ASCII: Ⅱ—Ⅳ
      # And a long line which should end up being trimmed blah blah
      A = Point(3, 4)
      B = Point(5, 2)
      k = Line(A, B)
    `;

    cy.window().then((window) => {
      window["PYGGB_CYPRESS"].ACE_EDITOR.setValue(deIndent(code));
      chooseFileMenuEntry("Share as link");

      // Can't test the COPY button actually copies because we don'have
      // access to the clipboard.  But we can get the url out of the
      // <input> elt.
      cy.get("input").then(($input) => {
        const shareUrl = $input[0].value;

        // Flush project so we can tell whether project-from-URL has
        // happened or not.
        createNewPyGgbFile(filename);

        cy.visit(shareUrl);
        cy.get(".modal-body").contains(
          `Create file ${filename.substring(0, 10)}`
        );
        cy.get("button").contains("Cancel").click();
        cy.get("div.modal").should("not.exist");
        cy.get(".editor .busy-overlay").should("not.be.visible");

        cy.window().then((window) => {
          expect(window["PYGGB_CYPRESS"].ACE_EDITOR.getValue()).contains(
            "writing your code"
          );

          cy.visit(shareUrl);
          cy.get(".modal-body").contains(
            `Create file ${filename.substring(0, 10)}`
          );
          cy.get("button").contains("Create").click();
          cy.get("div.modal").should("not.exist");
          cy.get(".editor .busy-overlay").should("not.be.visible");

          cy.window().then((window) => {
            expect(window["PYGGB_CYPRESS"].ACE_EDITOR.getValue()).contains(
              "Some non-ASCII: Ⅱ—Ⅳ"
            );
          });
        });
      });
    });
  });

  it("handles corrupt URLs", () => {
    const badShareUrl =
      "/" +
      "?name=laksdjflkasjdflkajsdf" +
      "&code=asdfjhkasdfkjlhasdkjlhasldjkh";

    cy.visit(badShareUrl);
    cy.get(".modal-body").contains("link does not work");
    cy.get("button").contains("Create").should("be.disabled");
    cy.get("button").contains("Cancel").click();
    cy.get("div.modal").should("not.exist");
    cy.get(".editor .busy-overlay").should("not.be.visible");
  });
});
