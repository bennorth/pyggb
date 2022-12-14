import React from "react";
import { CodeEditor } from "./CodeEditor";

const MenuBar = () => {
  return <div className="MenuBar"></div>;
};

export const IDE: React.FC<{}> = () => {
  return (
    <div className="pyggb-IDE abs-0000">
      <MenuBar />
      <div className="main-content">
        <div className="editor">
          <CodeEditor />
        </div>
        <div className="results">
          <div className="ggb"></div>
          <div className="stdout"></div>
        </div>
      </div>
    </div>
  );
};
