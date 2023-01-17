import { action, Action, computed, Computed, thunk, Thunk } from "easy-peasy";
import { PyGgbModel } from ".";
import { db, UserFilePreview } from "../shared/db";
import { ExampleProgramPreview } from "../shared/resources";
import { assertNever, fetchAsText } from "../shared/utils";

export type OperationalBackingFileStatus = "idle" | "loading" | "saving";

export type BackingFileSource =
  | { kind: "user-program"; id: number }
  | { kind: "example"; relativeUrl: string };

export type ContentKind = "nothing-yet-loaded" | BackingFileSource["kind"];

export type BackingFileState =
  | { status: "booting" }
  | {
      status: OperationalBackingFileStatus;
      source: BackingFileSource;
      name: string;
    };

export type OperationalBackingFileState = Exclude<
  BackingFileState,
  { status: "booting" }
>;

type CodeTextSnapshot = { seqNum: number; codeText: string };

export type Editor = {
  backingFileState: BackingFileState;
  contentKind: Computed<Editor, ContentKind>;
  codeText: string;
  codeTextSeqNum: number;
  backedSeqNum: number;
  setBackedSeqNum: Action<Editor, number>;
  setCodeText: Action<Editor, string>;
  updateCodeText: Action<Editor, string>;
  updateCodeTextAndScheduleSave: Thunk<Editor, string, {}, PyGgbModel>;
  setBackingFileState: Action<Editor, BackingFileState>;
  loadFromBacking: Thunk<Editor, UserFilePreview, {}, PyGgbModel>;
  loadExample: Thunk<Editor, ExampleProgramPreview, {}, PyGgbModel>;
  maybeUpdateBacking: Thunk<Editor, CodeTextSnapshot, {}, PyGgbModel>;
  createNew: Thunk<Editor, string>;
};

const InitialCodeTextSeqNum = 1001;

export const editor: Editor = {
  backingFileState: { status: "booting" },
  contentKind: computed((s) => {
    switch (s.backingFileState.status) {
      case "booting":
        return "nothing-yet-loaded";
      case "idle":
      case "loading":
      case "saving":
        return s.backingFileState.source.kind;
      default:
        return assertNever(s.backingFileState);
    }
  }),
  codeText: "",
  codeTextSeqNum: 0,
  backedSeqNum: 0,
  setCodeText: action((s, codeText) => {
    s.codeText = codeText;
    s.codeTextSeqNum = InitialCodeTextSeqNum;
  }),
  updateCodeText: action((s, codeText) => {
    s.codeText = codeText;
    s.codeTextSeqNum += 1;
  }),
  updateCodeTextAndScheduleSave: thunk((a, codeText, helpers) => {
    const seqNumAfterUpdate = helpers.getState().codeTextSeqNum + 1;
    a.updateCodeText(codeText);
    const snapshot: CodeTextSnapshot = { seqNum: seqNumAfterUpdate, codeText };
    setTimeout(() => a.maybeUpdateBacking(snapshot), 2000);
  }),
  setBackingFileState: action((s, state) => {
    s.backingFileState = state;
  }),
  setBackedSeqNum: action((s, seqNum) => {
    s.backedSeqNum = seqNum;
  }),
  loadFromBacking: thunk(async (a, userFilePreview, helpers) => {
    const state = helpers.getState();
    const status = state.backingFileState.status;
    if (status !== "booting" && status !== "idle") {
      console.error(`loadFromBacking(): in bad state ${status}`);
      return;
    }

    const source: BackingFileSource = {
      kind: "user-program",
      id: userFilePreview.id,
    };
    const loadingState: BackingFileState = {
      status: "loading",
      source,
      name: userFilePreview.name,
    };
    a.setBackingFileState(loadingState);

    const userFile = await db.userFiles.get(userFilePreview.id);
    if (userFile == null) {
      console.error(
        `could not get user-file ${JSON.stringify(userFilePreview)}`
      );
    } else {
      a.setCodeText(userFile.codeText);
      a.setBackedSeqNum(InitialCodeTextSeqNum);
    }

    const idleState: BackingFileState = {
      status: "idle",
      source,
      name: userFilePreview.name,
    };
    a.setBackingFileState(idleState);

    const storeActions = helpers.getStoreActions();
    storeActions.pyErrors.clearErrors();
    storeActions.pyStdout.clearContent();
  }),
  loadExample: thunk(async (a, example, helpers) => {
    const state = helpers.getState();
    const status = state.backingFileState.status;
    if (status !== "booting" && status !== "idle") {
      console.error(`loadFromBacking(): in bad state ${status}`);
      return;
    }

    const source: BackingFileSource = {
      kind: "example",
      relativeUrl: example.path,
    };
    const loadingState: BackingFileState = {
      status: "loading",
      source,
      name: example.name,
    };
    a.setBackingFileState(loadingState);

    const urlWithinApp = `examples/${example.path}`;
    const maybeCodeText = await fetchAsText(urlWithinApp);
    if (maybeCodeText == null) {
      console.error(`could not get user-file at "${example.path}"`);
    } else {
      // TODO: Set "read only" state somewhere.
      a.setCodeText(maybeCodeText);
      a.setBackedSeqNum(InitialCodeTextSeqNum);
    }

    const idleState: BackingFileState = {
      status: "idle",
      source,
      name: example.name,
    };
    a.setBackingFileState(idleState);

    const storeActions = helpers.getStoreActions();
    storeActions.pyErrors.clearErrors();
    storeActions.pyStdout.clearContent();
  }),

  maybeUpdateBacking: thunk(async (a, snapshot, helpers) => {
    const state = helpers.getState();

    if (state.codeTextSeqNum > snapshot.seqNum) {
      return;
    }

    const backingFileState = state.backingFileState;
    const bfStatus = backingFileState.status;
    switch (bfStatus) {
      case "booting":
      case "loading":
        console.error(`updateBacking(): in bad state ${bfStatus}`);
        return;
      case "saving":
        // Another save already in progress.  Should we ever get here?
        return;
      case "idle":
        const backingSource = backingFileState.source;
        if (backingSource.kind === "example") {
          console.error("should not be saving if source is URL");
          return;
        }
        const update = { id: backingSource.id, codeText: snapshot.codeText };
        a.setBackingFileState({ ...backingFileState, status: "saving" });
        await db.updateFile(update);
        a.setBackingFileState({ ...backingFileState, status: "idle" });
        a.setBackedSeqNum(snapshot.seqNum);
        return;
    }
  }),

  createNew: thunk(async (a, name) => {
    const preview = await db.createNewFile({ name });
    await a.loadFromBacking(preview);
  }),
};
