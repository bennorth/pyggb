import React from "react";
import { useStoreActions, useStoreState } from "../../store";
import { Button, Modal } from "react-bootstrap";
import { nullaryEventHandler } from "../../shared/utils";

export const FailedFileFromQueryModal: React.FC<{}> = () => {
  const state = useStoreState((s) => s.modals.failedFileFromQuery.state);
  const dismiss = nullaryEventHandler(
    useStoreActions((a) => a.modals.failedFileFromQuery.dismiss)
  );

  if (state.kind === "idle") {
    return null;
  }

  return (
    <Modal className="FailedFileFromQueryModal" show={true}>
      <Modal.Header>
        <Modal.Title>Problem creating file from link</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{state.message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={dismiss}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
