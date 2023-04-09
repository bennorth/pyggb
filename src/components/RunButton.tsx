import React from "react";
import { useStoreActions, useStoreState } from "../store";
import Button from "react-bootstrap/Button";

export const RunButton: React.FC<{}> = () => {
  const executionStatus = useStoreState((s) => s.controls.executionStatus);
  const runProgram = useStoreActions((a) => a.controls.runProgram);

  const enabled =
    executionStatus.state === "idle" || executionStatus.state === "paused";
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
  const executionStatus = useStoreState((s) => s.controls.executionStatus);
  const pauseProgram = useStoreActions((a) => a.controls.pauseProgram);

  const enabled = executionStatus.state === "sleeping";
  return (
    <div className="ControlButton pause-button">
      <Button
        variant="secondary"
        size="sm"
        disabled={!enabled}
        onClick={() => pauseProgram()}
      >
        PAUSE
      </Button>
    </div>
  );
};

export const StopButton: React.FC<{}> = () => {
  const executionStatus = useStoreState((s) => s.controls.executionStatus);
  const stopProgram = useStoreActions((a) => a.controls.stopProgram);

  const enabled =
    executionStatus.state === "paused" || executionStatus.state === "sleeping";

  return (
    <div className="ControlButton stop-button">
      <Button
        variant="danger"
        size="sm"
        disabled={!enabled}
        onClick={() => stopProgram()}
      >
        STOP
      </Button>
    </div>
  );
};
