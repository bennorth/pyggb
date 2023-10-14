describe("Open blank project", () => {
  it("can create blank project", () => {
    cy.visit("/?newBlank");

    // Depending on history, the title might be "New project (23)" or
    // similar, but this will match anyway:
    cy.get(".MenuBar").contains("New project");

    cy.window().then((window) => {
      const editorText = window["PYGGB_CYPRESS"].ACE_EDITOR.getValue();
      expect(editorText).to.equal("");
    });
  });
});
