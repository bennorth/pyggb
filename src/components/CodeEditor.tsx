import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

export const CodeEditor: React.FC<{}> = () => {
  return (
    <AceEditor
      mode="python"
      theme="github"
      name="pyggb-ace-editor"
      fontSize={14}
      width="100%"
      height="100%"
    />
  );
};
