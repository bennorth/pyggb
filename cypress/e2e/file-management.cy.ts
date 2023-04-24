import { v4 as uuidv4 } from "uuid";

describe("File management", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  const chooseFileMenuEntry = (entryMatch: string) => {
    cy.get(".MenuBar .nav-link").contains("File").click();
    cy.get(".dropdown-item").contains(entryMatch).click();
  };

  it("can create new file", () => {
    const filename = uuidv4();

    chooseFileMenuEntry("New");
    cy.get(".modal-body input").click().type(filename);
    cy.get("button").contains("Create").click();

    // Name of newly-created file should appear in the navbar / menubar:
    cy.get("div.modal").should("not.exist");
    cy.get(".editor .busy-overlay").should("not.be.visible");
    cy.get(".MenuBar").contains(filename);

    cy.window().then((window) => {
      const editorText = window["PYGGB_CYPRESS"].ACE_EDITOR.getValue();
      expect(editorText).to.equal("# Start writing your code!\n");

      window["PYGGB_CYPRESS"].ACE_EDITOR.setValue(
        `# This is file ${filename}\n`
      );

      cy.get("#pyggb-ace-editor").click("center");
      chooseFileMenuEntry("Open");
      cy.get(".FileChoice").contains(filename);
    });
  });

  it("can rename a file", () => {
    const filename = uuidv4();
    const newFilename = uuidv4();

    chooseFileMenuEntry("New");
    cy.get(".modal-body input").click().type(filename);
    cy.get("button").contains("Create").click();
    cy.get("div.modal").should("not.exist");
    cy.get(".editor .busy-overlay").should("not.be.visible");
    cy.get(".MenuBar").contains(filename);

    cy.get("span.FilenameDisplayOrEdit").dblclick();
    cy.get("input").clear().type(newFilename).type("{enter}");
    cy.get("span.FilenameDisplayOrEdit").contains(newFilename);
  });

  it("can create two files, switch between them, delete one", () => {
    const f1 = uuidv4();
    const f2 = uuidv4();

    chooseFileMenuEntry("New");

    cy.get(".modal-body input").click().type(f1);
    cy.get("button").contains("Create").click();

    // Name of newly-created file should appear in the navbar / menubar:
    cy.get("div.modal").should("not.exist");
    cy.get(".editor .busy-overlay").should("not.be.visible");
    cy.get(".MenuBar").contains(f1);

    cy.window().then((window) => {
      const editorText = window["PYGGB_CYPRESS"].ACE_EDITOR.getValue();
      expect(editorText).to.equal("# Start writing your code!\n");

      window["PYGGB_CYPRESS"].ACE_EDITOR.setValue(`# This is file ${f1}\n`);
      chooseFileMenuEntry("Save now");

      chooseFileMenuEntry("New");
      cy.get(".modal-body input").click().type(f2);
      cy.get("button").contains("Create").click();

      cy.get("div.modal").should("not.exist");
      cy.get(".editor .busy-overlay").should("not.be.visible");
      cy.get(".MenuBar").contains(f2);

      cy.window().then((window) => {
        const editorText = window["PYGGB_CYPRESS"].ACE_EDITOR.getValue();
        console.log("editorText", editorText);
        expect(editorText).to.equal("# Start writing your code!\n");

        window["PYGGB_CYPRESS"].ACE_EDITOR.setValue(`# This is file ${f2}\n`);
        chooseFileMenuEntry("Save now");
        chooseFileMenuEntry("Open");

        cy.get(".FileChoice").contains(f1).click();
        cy.get("div.modal").should("not.exist");
        cy.get(".editor .busy-overlay").should("not.be.visible");
        cy.get(".MenuBar").contains(f1);

        cy.window().then((window) => {
          const editorText = window["PYGGB_CYPRESS"].ACE_EDITOR.getValue();
          console.log("editorText", editorText);
          expect(editorText).to.equal(`# This is file ${f1}\n`);

          chooseFileMenuEntry("Open");
          cy.get(".FileChoice")
            .contains(f2)
            .parent()
            .find("button")
            .contains("DELETE")
            .click({ force: true });

          cy.get("div.modal").contains(`delete your program "${f2}"`);
          cy.get("button").contains("Delete").click();

          cy.get(".FileChoice").contains(f1);
          cy.get(".FileChoice").contains(f2).should("not.exist");
        });
      });
    });
  });
});
