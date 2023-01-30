import classnames from "classnames";
import React, { useEffect, useState } from "react";
import { Container, Navbar, NavDropdown, Spinner } from "react-bootstrap";
import { OperationalBackingFileState } from "../model/editor";
import { db } from "../shared/db";
import { assertNever } from "../shared/utils";
import { useStoreActions, useStoreState } from "../store";
import { RunButton } from "./RunButton";

type FilenameProps = {
  backingFileState: OperationalBackingFileState;
};

type FilenameEditState =
  | { status: "displaying" }
  | { status: "editing"; newName: string };

const FilenameDisplayOrEdit: React.FC<FilenameProps> = ({
  backingFileState,
}) => {
  const loadFromBacking = useStoreActions((a) => a.editor.loadFromBacking);
  const [editState, setEditState] = useState<FilenameEditState>({
    status: "displaying",
  });
  const inputRef = React.createRef<HTMLInputElement>();

  const editStatus = editState.status;

  useEffect(() => {
    if (editStatus === "editing" && inputRef.current != null) {
      inputRef.current.focus();
    }
  }, [editStatus, inputRef]);

  const launchEdit = () => {
    setEditState({ status: "editing", newName: backingFileState.name });
  };
  const setEditName = (newName: string) => {
    if (editState.status !== "editing") {
      console.warn("can't setEditName unless editing");
      return;
    }
    setEditState({ status: "editing", newName });
  };
  const doRename = async () => {
    if (editState.status !== "editing") {
      console.warn("can't doRename unless editing");
      return;
    }
    const backingSource = backingFileState.source;
    if (backingSource.kind !== "user-program") {
      console.warn("can't doRename unless source.kind is DB");
      return;
    }

    await db.renameFile(backingSource.id, editState.newName);
    // Redundant to reload whole file but will do for now:
    await loadFromBacking({
      id: backingSource.id,
      name: editState.newName,
    });
    setEditState({ status: "displaying" });
  };
  const handleMaybeSubmit = async (
    evt: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (editState.status !== "editing") {
      console.warn("can't handleMaybeSubmit unless editing");
      return;
    }
    if (evt.key === "Enter") {
      doRename();
    }
  };

  switch (editState.status) {
    case "displaying":
      return (
        <span className="FilenameDisplayOrEdit" onDoubleClick={launchEdit}>
          {backingFileState.name}
        </span>
      );
    case "editing":
      return (
        <input
          ref={inputRef}
          type="text"
          value={editState.newName}
          onKeyDown={(evt) => handleMaybeSubmit(evt)}
          onBlur={() => doRename()}
          onChange={(evt) => setEditName(evt.target.value)}
        />
      );
    default:
      console.error(`bad state ${JSON.stringify(editState)}`);
      return null;
  }
};

export const MenuBar: React.FC<{}> = () => {
  const backingState = useStoreState((s) => s.editor.backingFileState);
  const codeText = useStoreState((s) => s.editor.codeText);
  const fileChooserSetActive = useStoreActions(
    (a) => a.modals.fileChooser.setActive
  );
  const newFileLaunch = useStoreActions((a) => a.modals.newFile.launch);
  const downloadPythonLaunch = useStoreActions(
    (a) => a.modals.downloadPython.launch
  );

  const launchFileChooser = () => fileChooserSetActive(true);
  const launchNewFile = () => newFileLaunch(undefined);

  const downloadPython = (() => {
    switch (backingState.status) {
      case "booting":
        return () => {};
      case "idle":
      case "loading":
      case "saving":
        return () =>
          downloadPythonLaunch({
            storedName: backingState.name,
            content: codeText,
          });
      default:
        return assertNever(backingState);
    }
  })();

  const spinnerClasses = classnames({
    visible: backingState.status !== "idle",
  });

  const maybeBackingName =
    backingState.status === "booting" ? null : (
      <FilenameDisplayOrEdit backingFileState={backingState} />
    );

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
          <NavDropdown.Item onClick={downloadPython}>Download</NavDropdown.Item>
        </NavDropdown>
        <Navbar.Text className="backing-state">
          <Spinner size="sm" className={spinnerClasses}></Spinner>
          {maybeBackingName}
        </Navbar.Text>
      </Container>
    </Navbar>
  );
};
