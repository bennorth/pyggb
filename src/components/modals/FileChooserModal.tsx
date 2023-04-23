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
  isCurrent: boolean;
  dismiss: () => void;
  launchDeletionConfirmation(): void;
};

const FileChoice: React.FC<FileChoiceProps> = (props) => {
  const loadFromBacking = useStoreActions((a) => a.editor.loadFromBacking);
  const load = async () => {
    await loadFromBacking({ id: props.id, name: props.name });
    props.dismiss();
  };

  const deleteElement = props.isCurrent ? (
    <Button disabled>X</Button>
  ) : (
    <Button
      variant="danger"
      onClick={(e) => {
        e.stopPropagation();
        props.launchDeletionConfirmation();
      }}
    >
      DELETE
    </Button>
  );

  return (
    <li className="FileChoice" onClick={load}>
      <span className="file-name">{props.name}</span>
      {deleteElement}
    </li>
  );
};

const useSetPlainActivity = (
  kind: Exclude<FileChoiceActivity["kind"], "confirm-delete-user-file">
) => {
  const setActivity = useStoreActions((a) => a.modals.fileChooser.setActivity);
  return () => setActivity({ kind });
};

const useLaunchDeletion = () => {
  const setActivity = useStoreActions((a) => a.modals.fileChooser.setActivity);
  return (f: UserFilePreview) => () =>
    setActivity({ kind: "confirm-delete-user-file", id: f.id, name: f.name });
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
  const switchToUserFiles = useSetPlainActivity("choose-user-file");
  const dismiss = useSetPlainActivity("none");

  const load = (ex: ExampleProgramPreview) => () => {
    loadExample(ex);
    dismiss();
  };

  const content = (() => {
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
  })();

  return (
    <Modal size="xl" show={true} animation={false}>
      <Modal.Header>
        <Modal.Title>
          <Button onClick={switchToUserFiles} variant="outline-primary">
            My programs
          </Button>{" "}
          <Button variant="primary">Examples</Button>
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

const ConfirmDeletion: React.FC<UserFilePreview> = ({ id, name }) => {
  const dismiss = useSetPlainActivity("choose-user-file");
  const doDelete = async () => {
    await db.withLock(async () => {
      await db.deleteFile(id);
      dismiss();
    });
  };

  return (
    <Modal size="xl" show={true} animation={false}>
      <Modal.Header>
        <Modal.Title>Really delete "{name}"?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete your program "{name}"?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={dismiss}>
          Cancel
        </Button>
        <Button variant="danger" onClick={doDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
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
