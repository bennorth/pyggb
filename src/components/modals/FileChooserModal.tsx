import { useLiveQuery } from "dexie-react-hooks";
import React from "react";
import { Button, Modal } from "react-bootstrap";
import { db } from "../../shared/db";
import { useStoreActions, useStoreState } from "../../store";

export const FileChooserModal: React.FC<{}> = () => {
  const userFiles = useLiveQuery(() => db.allFiles());
  const active = useStoreState((s) => s.modals.fileChooser.active);
  const setActive = useStoreActions((a) => a.modals.fileChooser.setActive);

  const dismiss = () => setActive(false);

  return (
    <Modal size="xl" show={active}>
      <Modal.Header>
        <Modal.Title>Open file or example</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {userFiles && userFiles.length === 0 && <p>No files yet</p>}
        <ul>
          {userFiles?.map((f) => (
            <li key={f.id}>{f.name}</li>
          ))}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={dismiss}>
          Cancel
        </Button>
        <Button variant="primary">Open</Button>
      </Modal.Footer>
    </Modal>
  );
};
