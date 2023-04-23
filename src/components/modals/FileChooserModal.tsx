import { useLiveQuery } from "dexie-react-hooks";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button, Modal } from "react-bootstrap";
import { db, UserFilePreview } from "../../shared/db";
import { useJsonResource } from "../../shared/hooks";
import { ExampleProgramPreview } from "../../shared/resources";
import { useStoreActions, useStoreState } from "../../store";
import { FileChoiceActivity } from "../../model/modals/file-chooser";

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

const useSetPlainActivity = (
  kind: Exclude<FileChoiceActivity["kind"], "confirm-delete-user-file">
) => {
  const setActivity = useStoreActions((a) => a.modals.fileChooser.setActivity);
  return () => setActivity({ kind });
};

type FileChoiceScope = "user-file" | "example";

const UserFileList: React.FC<{}> = () => {
  const userFiles = useLiveQuery(() => db.withLock(() => db.allFiles()));
  const dismiss = useSetPlainActivity("none");
  const switchToExamples = useSetPlainActivity("choose-example");

  const content =
    userFiles == null ? (
      <div>LOADING...</div>
    ) : (
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

  return (
    <Modal size="xl" show={true} animation={false}>
      <Modal.Header>
        <Modal.Title>
          <Button variant="primary">My programs</Button>{" "}
          <Button onClick={switchToExamples} variant="outline-primary">
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
