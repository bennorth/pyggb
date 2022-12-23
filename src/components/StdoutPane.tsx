import React from "react";
import { useStoreState } from "../store";

export const StdoutPane: React.FC<{}> = () => {
  const content = useStoreState((s) => s.pyStdout.content);
  return (
    <div className="stdout">
      <pre>{content}</pre>
    </div>
  );
};
