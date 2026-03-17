import React, { useRef, useEffect } from "react";
import { useStoreState } from "../store";
import { EmptyProps } from "../shared/utils";

export const StdoutPane: React.FC<EmptyProps> = () => {
  const content = useStoreState((s) => s.pyStdout.content);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = divRef.current;
    if (div != null) {
      div.scrollTop = div.scrollHeight;
    }
  });

  return (
    <div className="stdout-outer">
      <div ref={divRef} className="stdout-inner abs-0000">
        <pre>{content}</pre>
      </div>
    </div>
  );
};
