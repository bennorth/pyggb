import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useStoreActions, useStoreState } from "../../store";

export const NewFileModal: React.FC<{}> = () => {
  const active = useStoreState((s) => s.modals.newFile.active);
  const setActive = useStoreActions((a) => a.modals.newFile.setActive);

  const [newName, setNewName] = useState("");
  const createEnabled = newName !== "";

  const dismiss = () => setActive(false);

  return (
    <Modal show={active}>
      <Modal.Header>
        <Modal.Title>Create new file</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            type="text"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
            }}
          ></Form.Control>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={dismiss}>
          Cancel
        </Button>
        <Button disabled={!createEnabled} variant="primary">
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
