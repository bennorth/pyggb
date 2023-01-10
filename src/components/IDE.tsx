import React from "react";
import classNames from "classnames";
import { useStoreState } from "../store";
import { CodeEditor } from "./CodeEditor";
import { ErrorList } from "./ErrorList";
import { GeoGebraPane } from "./GeoGebraPane";
import { MenuBar } from "./MenuBar";
import { StdoutPane } from "./StdoutPane";

const EditorMaybeErrors: React.FC<{}> = () => {
  const anyErrors = useStoreState((s) => s.pyErrors.any);

  const errorsContainerClasses = classNames(
    "editor-maybe-errors-inner",
    "abs-0000",
    anyErrors ? "has-errors" : "no-errors"
  );

  return (
    <div className="editor-maybe-errors-outer">
      <div className={errorsContainerClasses}>
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

export const IDE: React.FC<{}> = () => {
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
};
