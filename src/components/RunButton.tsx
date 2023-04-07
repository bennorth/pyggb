import React from "react";
import { useStoreActions, useStoreState } from "../store";
import Button from "react-bootstrap/Button";

export const RunButton: React.FC<{}> = () => {
  const executionStatus = useStoreState((s) => s.controls.executionStatus);
  const runProgram = useStoreActions((a) => a.controls.runProgram);

  const enabled = executionStatus.state === "idle";
  return (
    <div className="ControlButton run-button">
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

export const PauseButton: React.FC<{}> = () => {
  const enabled = true; // TODO
  return (
    <div className="ControlButton pause-button">
      <Button
        variant="secondary"
        size="sm"
        disabled={!enabled}
        onClick={() => {} /* TODO */}
      >
        PAUSE
      </Button>
    </div>
  );
};

export const StopButton: React.FC<{}> = () => {
  const enabled = true; // TODO
  return (
    <div className="ControlButton stop-button">
      <Button
        variant="danger"
        size="sm"
        disabled={!enabled}
        onClick={() => {} /* TODO */}
      >
        STOP
      </Button>
    </div>
  );
};
