import React from "react";
import { useStoreState } from "../store";

export const StdoutPane: React.FC<{}> = () => {
  const content = useStoreState((s) => s.pyStdout.content);
  return (
    <div className="stdout-outer">
      <div className="stdout-inner abs-0000">
        <pre>{content}</pre>
      </div>
    </div>
  );
};
