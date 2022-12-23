import classnames from "classnames";
import React from "react";
import { Container, Navbar, NavDropdown, Spinner } from "react-bootstrap";
import { useStoreActions, useStoreState } from "../store";
import { RunButton } from "./RunButton";

export const MenuBar: React.FC<{}> = () => {
  const backingState = useStoreState((s) => s.editor.backingFileState);

  const spinnerClasses = classnames({
    visible: backingState.status !== "idle",
  });

  const maybeBackingName =
    backingState.status === "booting" ? null : backingState.name;

  return (
    <Navbar>
      <Container fluid className="MenuBar">
        <Navbar.Brand>
          <RunButton />
        </Navbar.Brand>
        <NavDropdown title="File">
          <NavDropdown.Item>New</NavDropdown.Item>
          <NavDropdown.Item>Open</NavDropdown.Item>
          <NavDropdown.Item>Upload</NavDropdown.Item>
          <NavDropdown.Item>Make a copy</NavDropdown.Item>
          <NavDropdown.Item>Download</NavDropdown.Item>
        </NavDropdown>
        <Navbar.Text className="backing-state">
          <Spinner size="sm" className={spinnerClasses}></Spinner>
          {maybeBackingName}
        </Navbar.Text>
      </Container>
    </Navbar>
  );
};
