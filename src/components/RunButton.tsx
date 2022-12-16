import React from "react";
import { useStoreActions } from "../store";
import Button from "react-bootstrap/Button";

export const RunButton: React.FC<{}> = () => {
  const runProgram = useStoreActions((a) => a.controls.runProgram);
  return (
    <div className="RunButton" onClick={() => runProgram()}>
      <Button variant="success" size="sm">
        RUN
      </Button>
    </div>
  );
};
