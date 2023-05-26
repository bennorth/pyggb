import { Button, Modal, Spinner } from "react-bootstrap";
import { useStoreActions, useStoreState } from "../../store";
import { useEffect } from "react";
import {
  previewFromFullCode,
  previewFromString,
} from "../../model/modals/new-file-from-query";

export const NewFileFromQueryModal = () => {
  const state = useStoreState((s) => s.modals.newFileFromQuery.state);
  const boot = useStoreActions(
    (a) => a.modals.newFileFromQuery.bootFromSearchParams
  );
  const rejectOffer = useStoreActions(
    (a) => a.modals.newFileFromQuery.rejectOffer
  );
  const acceptOffer = useStoreActions(
    (a) => a.modals.newFileFromQuery.acceptOffer
  );

  useEffect(() => {
    const url = new URL(window.location.href);
    boot(url.searchParams);
  });

  const dismiss = () => rejectOffer();
  const create = () => acceptOffer();

  if (state.kind === "idle") return null;

  const body = (() => {
    switch (state.kind) {
      case "preparing":
        return <Spinner></Spinner>;
      case "failed":
        return <p>Sorry, that link does not work.</p>;
      case "offering": {
        const namePreview = previewFromString(state.name, 24);
        const codePreviewLines = previewFromFullCode(state.codeText, 4, 48);
        return (
          <>
            <p>
              Create file <strong>{namePreview}</strong>?
            </p>
            <p>Preview:</p>
            <div className="code-preview">
              {codePreviewLines.map((line, idx) => (
                <pre key={idx}>
                  <code className={line.kind}>{line.content}</code>
                </pre>
              ))}
            </div>
          </>
        );
      }
    }
  })();

  return (
    <Modal className="NewFileFromQueryModal" show={true}>
      <Modal.Header>
        <Modal.Title>Create file?</Modal.Title>
      </Modal.Header>
      <Modal.Body className={state.kind}>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={dismiss}>
          Cancel
        </Button>
        <Button variant="primary" onClick={create}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
