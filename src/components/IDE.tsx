import React from "react";
import classNames from "classnames";
import { useStoreActions, useStoreState } from "../store";
import { CodeEditor } from "./CodeEditor";
import { ErrorList } from "./ErrorList";
import { GeoGebraPane } from "./GeoGebraPane";
import { MenuBar } from "./MenuBar";
import { StdoutPane } from "./StdoutPane";
import { Button } from "react-bootstrap";
import { assertNever } from "../shared/utils";

const CopyExampleButton: React.FC<{}> = () => {
  const newFileLaunch = useStoreActions((a) => a.modals.newFile.launch);
  const exampleCodeText = useStoreState((s) => s.editor.codeText);
  const isLoaded = useStoreState(
    (s) => s.editor.backingFileState.status === "idle"
  );

  // TODO: Allow specification of modal title (eg New File vs Make Copy
  // of Example).
  const doCopyExample = () => newFileLaunch(exampleCodeText);

  const classes = classNames("copy-example", isLoaded && "codetext-ready");

  return (
    <div className={classes}>
      <p>You cannot edit the code below because this is an example.</p>
      <Button disabled={!isLoaded} onClick={doCopyExample}>
        Make your own copy of the program
      </Button>
    </div>
  );
};

const EditorMaybeErrors: React.FC<{}> = () => {
  const anyErrors = useStoreState((s) => s.pyErrors.any);
  const contentKind = useStoreState((s) => s.editor.contentKind);

  const errorsContainerClasses = classNames(
    "editor-maybe-errors-inner",
    "abs-0000",
    anyErrors ? "has-errors" : "no-errors",
    `content-${contentKind}`
  );

  return (
    <div className="editor-maybe-errors-outer">
      <div className={errorsContainerClasses}>
        <div className="copy-invitation-container">
          <CopyExampleButton />
        </div>
        <div className="editor">
          <CodeEditor />
        </div>
        <div className="errors-container">
          <ErrorList />
        </div>
      </div>
    </div>
  );
};

const GgbConstructionOnly: React.FC<{}> = () => {
  const content = (
    <div className="ggb">
      <GeoGebraPane />
    </div>
  );

  return <div className="pyggb-construction-only abs-0000">{content}</div>;
};

export const IDE: React.FC<{}> = () => {
  const uiStyle = useStoreState((s) => s.uiSettings.uiLayout);

  switch (uiStyle) {
    case "full":
      return (
        <div className="pyggb-IDE abs-0000">
          <MenuBar />
          <div className="main-content">
            <EditorMaybeErrors />
            <div className="results">
              <div className="ggb">
                <GeoGebraPane />
              </div>
              <StdoutPane />
            </div>
          </div>
        </div>
      );
    case "ggb-construction-only":
      // TODO
    default:
      return assertNever(uiStyle);
  }
};
