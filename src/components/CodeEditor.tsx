import React, { createRef, useEffect, useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import { useStoreActions, useStoreState } from "../store";
import ReactAce from "react-ace/lib/ace";
import { PYGGB_CYPRESS } from "../shared/utils";

export const CodeEditor: React.FC<{}> = () => {
  const codeText = useStoreState((s) => s.editor.codeText);
  const setCodeText = useStoreActions(
    (a) => a.editor.updateCodeTextAndScheduleSave
  );
  const allDependenciesReady = useStoreState((s) => s.dependencies.allReady);
  const contentKind = useStoreState((s) => s.editor.contentKind);

  const [lastWd, setLastWd] = useState<number>(-1);
  const [lastHt, setLastHt] = useState<number>(-1);

  const aceRef = createRef<ReactAce>();

  const isReadWrite = allDependenciesReady && contentKind === "user-program";

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

  const setGlobalRef = (editor: any) => {
    PYGGB_CYPRESS().ACE_EDITOR = editor;
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
        onLoad={setGlobalRef}
      />
    </>
  );
};
