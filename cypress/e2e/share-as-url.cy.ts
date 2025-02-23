import { v4 as uuidv4 } from "uuid";
import { chooseFileMenuEntry, createNewPyGgbFile, deIndent } from "./shared";
import { encode as utf8BinaryStringFromString } from "utf8";
import { encode as b64StringFromBinaryString } from "base-64";

describe("Share as URL", () => {
  const codeWithMarker = (marker: string) => {
    return deIndent(`
      # Some non-ASCII: Ⅱ—Ⅳ
      A = Point(3, 4)
      B = Point(5, 2)
      k = Line(A, B)
      print("hello world ${marker}")
    `);
  };

  const uncompressedShareSpec = () => {
    const uniqueMarker = uuidv4();
    const pythonOutput = `hello world ${uniqueMarker}`;
    const code = codeWithMarker(uniqueMarker);

    const bstrCode = utf8BinaryStringFromString(code);
    const pCode = b64StringFromBinaryString(bstrCode);

    const shareUrl = `/?name=Testing123&code=${pCode}&cck=none`;
    return { pythonOutput, shareUrl };
  };

  it("can use URL with uncompressed code", () => {
    const { pythonOutput, shareUrl } = uncompressedShareSpec();
    cy.visit(shareUrl);
    cy.get(".stdout-inner").contains(pythonOutput);
  });

  it("can choose startup IDE layout", () => {
    const { shareUrl } = uncompressedShareSpec();
    const fullUrl = `${shareUrl}&justCanvas=true`;
    cy.visit(fullUrl);
    cy.get(".App .pyggb-construction-only .ggb");
    cy.get(".MenuBar").should("not.exist");
  });

  it("can create and use URL for project", () => {
    cy.visit("/");

    const uniqueMarker = uuidv4();
    const pythonOutput = `hello world ${uniqueMarker}`;
    const code = codeWithMarker(uniqueMarker);

    // Include some non-ASCII characters:
    const filename = `😀😀😀 ${uniqueMarker}`;
    createNewPyGgbFile(filename);

    cy.window().then((window) => {
      window["PYGGB_CYPRESS"].ACE_EDITOR.setValue(code);
      chooseFileMenuEntry("Share as link");

      // Can't test the COPY button actually copies because we don't
      // have access to the clipboard.  But we can get the url out of
      // the relevant <input> elt.
      cy.get("input.shareUrl").then(($input) => {
        const shareUrl = ($input[0] as HTMLInputElement).value;

        // Flush project so we can tell whether project-from-URL has
        // happened or not.
        createNewPyGgbFile(`SECOND ${filename}`);
        cy.window().then((window) => {
          expect(window["PYGGB_CYPRESS"].ACE_EDITOR.getValue()).contains(
            "writing your code"
          );

          cy.visit(shareUrl);
          // Should have auto-run:
          cy.get(".stdout-inner").contains(pythonOutput);

          cy.get(".editor .busy-overlay").should("not.be.visible");

          cy.window().then((window) => {
            const codeText = window["PYGGB_CYPRESS"].ACE_EDITOR.getValue();
            expect(codeText).contains("Some non-ASCII: Ⅱ—Ⅳ");
            expect(codeText).contains(uniqueMarker);
          });
        });
      });
    });
  });

  const b64Pass = b64StringFromBinaryString("pass\n");
  const badUrlSpecs = [
    {
      label: "bad b64",
      url: "/?name=laksdjflkasjdflkajsdf&code=asdfjhkasdfkjlhasdkjlhasldjkh",
    },
    {
      label: "bad cck",
      url: `/?name=badcompressionkind&code=${b64Pass}&cck=banana`,
    },
  ];

  badUrlSpecs.forEach((spec) =>
    it(`handles corrupt URL (${spec.label})`, () => {
      cy.visit(spec.url);
      cy.get(".modal-body").contains("wrong trying to use that link");
      cy.get("button").contains("OK").click();
      cy.get("div.modal").should("not.exist");
      cy.get(".editor .busy-overlay").should("not.be.visible");
    })
  );
});
