import React from "react";
import { CodeEditor } from "./CodeEditor";
import { GeoGebraPane } from "./GeoGebraPane";
import { MenuBar } from "./MenuBar";
import { StdoutPane } from "./StdoutPane";

export const IDE: React.FC<{}> = () => {
  return (
    <div className="pyggb-IDE abs-0000">
      <MenuBar />
      <div className="main-content">
        <div className="editor">
          <CodeEditor />
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
