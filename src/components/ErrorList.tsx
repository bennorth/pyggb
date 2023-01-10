import React from "react";
import { useStoreState } from "../store";

export const ErrorList: React.FC<{}> = () => {
  const errors = useStoreState((s) => s.pyErrors.errors);

  return (
    <div className="ErrorList abs-0000">
      <div className="error-list-inner">
        <h1>Your program has a problem:</h1>
      </div>
    </div>
  );
};
