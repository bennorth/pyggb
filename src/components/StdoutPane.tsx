import React, { createRef, useEffect } from "react";
import { useStoreState } from "../store";
import { EmptyProps } from "../shared/utils";

export const StdoutPane: React.FC<EmptyProps> = () => {
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
