import { useLiveQuery } from "dexie-react-hooks";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { db, UserFilePreview } from "../../shared/db";
import { useStoreActions, useStoreState } from "../../store";

type FileChoiceProps = UserFilePreview & {
  dismiss: () => void;
};

const FileChoice: React.FC<FileChoiceProps> = (props) => {
  const loadFromBacking = useStoreActions((a) => a.editor.loadFromBacking);
  const load = () => {
    loadFromBacking({ id: props.id, name: props.name });
    props.dismiss();
  };

  return (
    <li className="FileChoice" onClick={load}>
      {props.name}
    </li>
  );
};

type FileChoiceScope = "user-file" | "example";

const UserFileList: React.FC<{}> = () => {
  const userFiles = useLiveQuery(() => db.allFiles());
  const setActive = useStoreActions((a) => a.modals.fileChooser.setActive);

  const dismiss = () => setActive(false);

  if (userFiles == null) {
    return <div>LOADING...</div>;
  }

  return (
    <>
      {userFiles.length === 0 && <p>No files yet</p>}
      <ul className="FileChoice-list">
        {userFiles.map((f) => (
          <FileChoice
            key={f.id}
            id={f.id}
            name={f.name}
            dismiss={dismiss}
          ></FileChoice>
        ))}
      </ul>
    </>
  );
};

export const FileChooserModal: React.FC<{}> = () => {
  const [scope, setScope] = useState<FileChoiceScope>("user-file");

  const active = useStoreState((s) => s.modals.fileChooser.active);
  const setActive = useStoreActions((a) => a.modals.fileChooser.setActive);

  const dismiss = () => setActive(false);
  const setScopeFun =
    (scope: FileChoiceScope): (() => void) =>
    () =>
      setScope(scope);

  const content = (() => {
    switch (scope) {
      case "user-file":
        return <UserFileList />;
      case "example":
        return <div>EXAMPLES GO HERE</div>;
      default:
        return <div>ERROR</div>;
    }
  })();

  const filesButtonVar = scope === "user-file" ? "primary" : "outline-primary";
  const examplesButtonVar = scope === "example" ? "primary" : "outline-primary";

  return (
    <Modal size="xl" show={active}>
      <Modal.Header>
        <Modal.Title>
          <Button onClick={setScopeFun("user-file")} variant={filesButtonVar}>
            My programs
          </Button>{" "}
          <Button onClick={setScopeFun("example")} variant={examplesButtonVar}>
            Examples
          </Button>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{content}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={dismiss}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
