import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import { useStoreActions, useStoreState } from "../store";
import { EmptyProps, PYGGB_CYPRESS } from "../shared/utils";
import classNames from "classnames";
import { Spinner } from "react-bootstrap";
import { IAceEditor } from "react-ace/lib/types";

export const CodeEditor: React.FC<EmptyProps> = () => {
  const backingStatus = useStoreState((s) => s.editor.backingFileState.status);

  const codeText = useStoreState((s) => s.editor.codeText);
  const setCodeText = useStoreActions(
    (a) => a.editor.updateCodeTextAndScheduleSave
  );
  const runProgram = useStoreActions((a) => a.controls.runProgram);
  const allDependenciesReady = useStoreState((s) => s.dependencies.allReady);
  const contentKind = useStoreState((s) => s.editor.contentKind);

  const isReadWrite =
    allDependenciesReady &&
    (backingStatus === "idle" || backingStatus === "saving") &&
    contentKind === "user-program";

  const onEditorLoad = (editor: IAceEditor) => {
    PYGGB_CYPRESS().ACE_EDITOR = editor;
    editor.commands.addCommand({
      name: "runProgram",
      bindKey: { mac: "Ctrl-Enter", win: "Ctrl-Enter" },
      exec: () => runProgram(),
    });
  };

  return (
    <>
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
        onLoad={onEditorLoad}
      />
      <div className={classNames("abs-0000", "busy-overlay", backingStatus)}>
        <Spinner />
      </div>
    </>
  );
};
