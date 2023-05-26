import classnames from "classnames";
import React, { useEffect, useState } from "react";
import { Container, Navbar, NavDropdown, Spinner } from "react-bootstrap";
import { OperationalBackingFileState } from "../model/editor";
import { assertNever } from "../shared/utils";
import { useStoreActions, useStoreState } from "../store";
import { RunButton, PauseButton, StopButton } from "./RunButton";
import { AboutButton } from "./AboutButton";

type FilenameProps = {
  backingFileState: OperationalBackingFileState;
};

type FilenameEditState =
  | { status: "displaying" }
  | { status: "editing"; newName: string };

const FilenameDisplayOrEdit: React.FC<FilenameProps> = ({
  backingFileState,
}) => {
  const renameAction = useStoreActions((a) => a.editor.renameCurrentAndRefresh);

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
    await renameAction(editState.newName);
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

const doNothing = () => {};

export const MenuBar: React.FC<{}> = () => {
  const allDependenciesReady = useStoreState((s) => s.dependencies.allReady);
  const backingState = useStoreState((s) => s.editor.backingFileState);
  const codeText = useStoreState((s) => s.editor.codeText);
  const fileChooserSetActivity = useStoreActions(
    (a) => a.modals.fileChooser.setActivity
  );
  const newFileLaunch = useStoreActions((a) => a.modals.newFile.launch);
  const downloadPythonLaunch = useStoreActions(
    (a) => a.modals.downloadPython.launch
  );
  const shareAsLinkLaunch = useStoreActions((a) => a.modals.shareAsUrl.launch);
  const saveCodeTextAction = useStoreActions((a) => a.editor.saveCodeText);

  const launchFileChooser = () =>
    fileChooserSetActivity({ kind: "choose-user-file" });

  const launchNewFile = () => newFileLaunch(undefined);
  const saveCodeText = () => saveCodeTextAction();

  const { downloadPython, shareAsLink } = (() => {
    switch (backingState.status) {
      case "booting": {
        return { downloadPython: doNothing, shareAsLink: doNothing };
      }
      case "idle":
      case "loading":
      case "saving": {
        const downloadPython = () =>
          downloadPythonLaunch({
            storedName: backingState.name,
            content: codeText,
          });
        const shareAsLink = () =>
          shareAsLinkLaunch({ name: backingState.name, codeText });
        return { downloadPython, shareAsLink };
      }
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

  if (!allDependenciesReady) {
    return (
      <Navbar>
        <Container fluid className="MenuBar">
          <Navbar.Text className="loading-text">Loading...</Navbar.Text>
        </Container>
      </Navbar>
    );
  }

  return (
    <Navbar>
      <Container fluid className="MenuBar">
        <Navbar.Brand>
          <RunButton />
        </Navbar.Brand>
        <Navbar.Brand>
          <PauseButton />
        </Navbar.Brand>
        <Navbar.Brand>
          <StopButton />
        </Navbar.Brand>
        <NavDropdown title="File">
          <NavDropdown.Item onClick={launchNewFile}>New</NavDropdown.Item>
          <NavDropdown.Item onClick={launchFileChooser}>Open</NavDropdown.Item>
          <NavDropdown.Item disabled>Upload</NavDropdown.Item>
          <NavDropdown.Item disabled>Make a copy</NavDropdown.Item>
          <NavDropdown.Item onClick={saveCodeText}>Save now</NavDropdown.Item>
          <NavDropdown.Item onClick={downloadPython}>Download</NavDropdown.Item>
        </NavDropdown>
        <Navbar.Text className="backing-state">
          <div className="spinner-container">
            <Spinner size="sm" className={spinnerClasses}></Spinner>
          </div>
          {maybeBackingName}
        </Navbar.Text>
        <Navbar.Brand>
          <AboutButton />
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};
