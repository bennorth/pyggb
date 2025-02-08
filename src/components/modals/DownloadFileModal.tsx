import React, { KeyboardEvent } from "react";
import { PyGgbModel } from "../../model";
import { DownloadFsmState } from "../../model/modals/download-file";
import { Actions, State } from "easy-peasy";
import { useStoreActions, useStoreState } from "../../store";
import { Button, Form, Modal } from "react-bootstrap";

type DownloadFileModalProps = {
  fileTypeDisplayName: string;
  selectFsmState: (state: State<PyGgbModel>) => DownloadFsmState;
  selectFilename: (state: State<PyGgbModel>) => string;
  selectSetFilename: (actions: Actions<PyGgbModel>) => (v: string) => void;
};
export const DownloadFileModal: React.FC<DownloadFileModalProps> = ({
  fileTypeDisplayName,
  selectFsmState,
  selectFilename,
  selectSetFilename,
}) => {
  const fsmState = useStoreState(selectFsmState);
  const filename = useStoreState(selectFilename);
  const setFilename = useStoreActions(selectSetFilename);

  if (fsmState.kind === "idle") {
    return null;
  }

  const settle = fsmState.userSettle;

  const downloadEnabled = filename !== "";

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    console.log(e);
    if (e.key === "Enter") {
      if (downloadEnabled) {
        settle("submit");
      }
      e.preventDefault();
    }
  };

  return (
    <Modal show={true} onEscapeKeyDown={() => settle("cancel")}>
      <Modal.Header>
        <Modal.Title>Download as {fileTypeDisplayName} file</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            type="text"
            value={filename}
            onChange={(e) => {
              setFilename(e.target.value);
            }}
            onKeyDown={onKeyDown}
          ></Form.Control>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => settle("cancel")}>
          Cancel
        </Button>
        <Button
          disabled={!downloadEnabled}
          variant="primary"
          onClick={() => settle("submit")}
        >
          Download
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
