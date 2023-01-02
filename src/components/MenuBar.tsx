import classnames from "classnames";
import React from "react";
import { Container, Navbar, NavDropdown, Spinner } from "react-bootstrap";
import { OperationalBackingFileState } from "../model/editor";
import { useStoreActions, useStoreState } from "../store";
import { RunButton } from "./RunButton";

type FilenameProps = {
  backingFileState: OperationalBackingFileState;
};

const FilenameDisplayOrEdit: React.FC<FilenameProps> = ({
  backingFileState,
}) => {
};

export const MenuBar: React.FC<{}> = () => {
  const backingState = useStoreState((s) => s.editor.backingFileState);
  const fileChooserSetActive = useStoreActions(
    (a) => a.modals.fileChooser.setActive
  );
  const newFileSetActive = useStoreActions((a) => a.modals.newFile.setActive);

  const launchFileChooser = () => fileChooserSetActive(true);
  const launchNewFile = () => newFileSetActive(true);

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
          <NavDropdown.Item onClick={launchNewFile}>New</NavDropdown.Item>
          <NavDropdown.Item onClick={launchFileChooser}>Open</NavDropdown.Item>
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
