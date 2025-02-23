import React, { createRef, useEffect, useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import { useStoreActions, useStoreState } from "../store";
import ReactAce from "react-ace/lib/ace";
import { PYGGB_CYPRESS } from "../shared/utils";
import classNames from "classnames";
import { Spinner } from "react-bootstrap";

export const CodeEditor: React.FC<{}> = () => {
  const backingStatus = useStoreState((s) => s.editor.backingFileState.status);

  const codeText = useStoreState((s) => s.editor.codeText);
  const setCodeText = useStoreActions(
    (a) => a.editor.updateCodeTextAndScheduleSave
  );
  const runProgram = useStoreActions((a) => a.controls.runProgram);
  const allDependenciesReady = useStoreState((s) => s.dependencies.allReady);
  const contentKind = useStoreState((s) => s.editor.contentKind);

  const [lastWd, setLastWd] = useState<number>(-1);
  const [lastHt, setLastHt] = useState<number>(-1);

  const aceRef = createRef<ReactAce>();

  const isReadWrite =
    allDependenciesReady &&
    (backingStatus === "idle" || backingStatus === "saving") &&
    contentKind === "user-program";

  // Force the Ace Editor to adapt itself to the new size whenever the
  // client dimensions change.
  //
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const aceEditor = aceRef.current;
    const aceWidth = aceRef.current?.refEditor.clientWidth ?? -1;
    const aceHeight = aceRef.current?.refEditor.clientHeight ?? -1;

    if (aceEditor != null && (lastWd !== aceWidth || lastHt !== aceHeight)) {
      setLastWd(aceWidth);
      setLastHt(aceHeight);
      aceEditor.editor.resize();
    }
  });

  const onEditorLoad = (editor: any) => {
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
        ref={aceRef}
        onLoad={onEditorLoad}
      />
      <div className={classNames("abs-0000", "busy-overlay", backingStatus)}>
        <Spinner />
      </div>
    </>
  );
};
