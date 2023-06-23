import { Spinner, Button, Modal, Form } from "react-bootstrap";
import { useStoreActions, useStoreState } from "../../store";
import React, { useState } from "react";

const BodyComputing = () => {
  return (
    <div className="ShareAsUrlModalBody computing">
      <Spinner></Spinner>
    </div>
  );
};

type BodyReadyProps = { url: string };
const BodyReady: React.FC<BodyReadyProps> = ({ url }) => {
  const [showCopiedIndicator, setShowCopiedIndicator] = useState(false);
  const [autoRun, setAutoRun] = useState(true);
  const fullUrl = url + (autoRun ? "" : "&autorun=false");

  const copy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setShowCopiedIndicator(true);
    setTimeout(() => setShowCopiedIndicator(false), 1200);
  };

  const toggleAutoRun = () => {
    setAutoRun(!autoRun);
  };

  const buttonLabel = showCopiedIndicator ? "✓" : "Copy";

  return (
    <div className="ShareAsUrlModalBody ready">
      <div className="content">
        <div className="toggle">
          <Form.Check
            checked={autoRun}
            onChange={toggleAutoRun}
            type="switch"
            id="share-as-url-autorun-toggle"
            label="Run program automatically from link?"
          />
        </div>
        <div className="text-and-button">
          <input className="shareUrl" readOnly size={45} value={fullUrl} />
          <Button onClick={copy}>{buttonLabel}</Button>
        </div>
      </div>
    </div>
  );
};

export const ShareAsUrlModal = () => {
  const state = useStoreState((s) => s.modals.shareAsUrl.state);
  const close = useStoreActions((a) => a.modals.shareAsUrl.close);

  if (state.kind === "idle") {
    return null;
  }

  const dismiss = () => close();

  const body = (() => {
    switch (state.kind) {
      case "computing":
        return <BodyComputing />;
      case "ready":
        return <BodyReady url={state.url} />;
    }
  })();

  return (
    <Modal show={true} onHide={dismiss}>
      <Modal.Header closeButton>
        <Modal.Title>Share file as link</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
    </Modal>
  );
};
