import { useLiveQuery } from "dexie-react-hooks";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button, Modal } from "react-bootstrap";
import { db, UserFilePreview } from "../../shared/db";
import { useJsonResource } from "../../shared/hooks";
import { ExampleProgramPreview } from "../../shared/resources";
import { useStoreActions, useStoreState } from "../../store";

type FileChoiceProps = UserFilePreview & {
  dismiss: () => void;
};

const FileChoice: React.FC<FileChoiceProps> = (props) => {
  const loadFromBacking = useStoreActions((a) => a.editor.loadFromBacking);
  const load = async () => {
    await loadFromBacking({ id: props.id, name: props.name });
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
  const userFiles = useLiveQuery(() => db.withLock(() => db.allFiles()));
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

const ExampleList: React.FC<{}> = () => {
  const loadExample = useStoreActions((a) => a.editor.loadExample);
  const examples = useJsonResource("examples/index.json");
  const setActive = useStoreActions((a) => a.modals.fileChooser.setActive);

  const dismiss = () => setActive(false);

  const load = (ex: ExampleProgramPreview) => () => {
    loadExample(ex);
    dismiss();
  };

  switch (examples.status) {
    case "idle":
    case "pending":
      return <div>Loading...</div>;
    case "failed":
      return <div>Error!</div>;
    case "succeeded":
      // TODO: Validate examples.data is Array<ExampleProgramPreview>.
      return (
        <ul className="ExampleList">
          {(examples.data as Array<ExampleProgramPreview>).map((ex, idx) => {
            return (
              <li key={idx} onClick={load(ex)}>
                <h1>{ex.name}</h1>
                <ReactMarkdown
                  children={ex.docMarkdown}
                  remarkPlugins={[remarkGfm]}
                />
              </li>
            );
          })}
        </ul>
      );
  }
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
        return <ExampleList />;
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
