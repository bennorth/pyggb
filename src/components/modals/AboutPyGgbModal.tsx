import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useStoreActions, useStoreState } from "../../store";

type NewTabAProps = {
  href: string;
  children?: React.ReactNode;
};

const NewTabA: React.FC<NewTabAProps> = ({ href, children }) => {
  return (
    <a target="_blank" rel="noreferrer" href={href}>
      {children}
    </a>
  );
};

export const AboutPyGgbModal: React.FC<{}> = () => {
  const isActive = useStoreState((s) => s.modals.aboutPyGgb.active);
  const setActive = useStoreActions((a) => a.modals.aboutPyGgb.setActive);
  const dismiss = () => setActive(false);

  return (
    <Modal className="AboutPyGgbModal" show={isActive} animation={false}>
      <Modal.Header>
        <Modal.Title>About PyGgb</Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button onClick={dismiss}>OK</Button>
      </Modal.Footer>
    </Modal>
  );
};
