import React from "react";
import { useStoreActions, useStoreState } from "../store";
import Button from "react-bootstrap/Button";

export const RunButton: React.FC<{}> = () => {
  const executionStatus = useStoreState((s) => s.controls.executionStatus);
  const runProgram = useStoreActions((a) => a.controls.runProgram);

  const enabled = executionStatus === "idle";
  return (
    <div className="RunButton" onClick={() => runProgram()}>
      <Button variant="success" size="sm" disabled={!enabled}>
        RUN
      </Button>
    </div>
  );
};
