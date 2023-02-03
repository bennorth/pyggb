import React from "react";
import { useStoreActions, useStoreState } from "../store";
import Button from "react-bootstrap/Button";

export const RunButton: React.FC<{}> = () => {
  const executionStatus = useStoreState((s) => s.controls.executionStatus);
  const runProgram = useStoreActions((a) => a.controls.runProgram);

  const enabled = executionStatus === "idle";
  return (
    <div className="RunButton">
      <Button
        variant="success"
        size="sm"
        disabled={!enabled}
        onClick={() => runProgram()}
      >
        RUN
      </Button>
    </div>
  );
};
