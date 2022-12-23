import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useStoreActions, useStoreState } from "../../store";

export const NewFileModal: React.FC<{}> = () => {
  const active = useStoreState((s) => s.modals.newFile.active);
  const setActive = useStoreActions((a) => a.modals.newFile.setActive);

  const dismiss = () => setActive(false);

  return (
    <Modal show={active}>
      <Modal.Header>
        <Modal.Title>Create new file</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control type="text"></Form.Control>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={dismiss}>
          Cancel
        </Button>
        <Button variant="primary">Create</Button>
      </Modal.Footer>
    </Modal>
  );
};
