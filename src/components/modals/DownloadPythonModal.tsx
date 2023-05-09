import React, { KeyboardEvent } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useStoreActions, useStoreState } from "../../store";

export const DownloadPythonModal: React.FC<{}> = () => {
  const active = useStoreState((s) => s.modals.downloadPython.active);
  const setActive = useStoreActions((a) => a.modals.downloadPython.setActive);
  const filename = useStoreState((s) => s.modals.downloadPython.filename);
  const setFilename = useStoreActions(
    (a) => a.modals.downloadPython.setFilename
  );
  const downloadThunk = useStoreActions(
    (a) => a.modals.downloadPython.download
  );

  const downloadEnabled = filename !== "";

  const dismiss = () => setActive(false);

  // TODO: This should be a thunk in the model:
  const resetAndClose = () => {
    setFilename(""); // Ready for next time
    dismiss();
  };

  // TODO: And this too?
  const download = () => {
    downloadThunk();
    resetAndClose();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (downloadEnabled) {
        download();
      }
      e.preventDefault();
    }
    if (e.key === "Escape") {
      resetAndClose();
    }
  };

  return (
    <Modal show={active}>
      <Modal.Header>
        <Modal.Title>Download as Python file</Modal.Title>
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
        <Button variant="secondary" onClick={dismiss}>
          Cancel
        </Button>
        <Button
          disabled={!downloadEnabled}
          variant="primary"
          onClick={download}
        >
          Download
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
