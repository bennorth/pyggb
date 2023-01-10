import React from "react";
import { useStoreState } from "../store";

export const ErrorList: React.FC<{}> = () => {
  const errors = useStoreState((s) => s.pyErrors.errors);

  return (
    <div className="ErrorList abs-0000">
    </div>
  );
};
