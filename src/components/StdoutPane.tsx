import React, { createRef, useEffect } from "react";
import { useStoreState } from "../store";

export const StdoutPane: React.FC<{}> = () => {
  const content = useStoreState((s) => s.pyStdout.content);
  const divRef = createRef<HTMLDivElement>();

  useEffect(() => {
    divRef.current!.scrollTop = divRef.current!.scrollHeight;
  });

  return (
    <div className="stdout-outer">
      <div ref={divRef} className="stdout-inner abs-0000">
        <pre>{content}</pre>
      </div>
    </div>
  );
};
