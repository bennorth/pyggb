import React from "react";
import { CodeEditor } from "./CodeEditor";
import { ErrorList } from "./ErrorList";
import { GeoGebraPane } from "./GeoGebraPane";
import { MenuBar } from "./MenuBar";
import { StdoutPane } from "./StdoutPane";

export const IDE: React.FC<{}> = () => {
  return (
    <div className="pyggb-IDE abs-0000">
      <MenuBar />
      <div className="main-content">
        <div className="editor-maybe-errors-outer">
          <div className="editor-maybe-errors-inner abs-0000">
            <div className="editor">
              <CodeEditor />
            </div>
            {/* TODO: Only show if there are errors. */}
            <div className="errors-container">
              <ErrorList />
            </div>
          </div>
        </div>
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
