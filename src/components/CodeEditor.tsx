import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import { useStoreActions, useStoreState } from "../store";

export const CodeEditor: React.FC<{}> = () => {
  const codeText = useStoreState((s) => s.editor.codeText);
  const setCodeText = useStoreActions(
    (a) => a.editor.updateCodeTextAndScheduleSave
  );
  const allReady = useStoreState((s) => s.dependencies.allReady);
  const contentKind = useStoreState((s) => s.editor.contentKind);

  const isReadWrite = allReady && contentKind === "user-program";

  return (
    <AceEditor
      mode="python"
      theme="github"
      name="pyggb-ace-editor"
      fontSize={14}
      width="100%"
      height="100%"
      value={codeText}
      onChange={setCodeText}
      readOnly={!isReadWrite}
    />
  );
};
