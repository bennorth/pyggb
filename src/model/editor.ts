import { action, Action, thunk, Thunk } from "easy-peasy";
import { PyGgbModel } from ".";
import { db, UserFilePreview } from "../shared/db";

export type OperationalBackingFileStatus = "idle" | "loading" | "saving";

export type BackingFileState =
  | { status: "booting" }
  | {
      status: OperationalBackingFileStatus;
      id: number;
      name: string;
    };

type CodeTextSnapshot = { seqNum: number; codeText: string };

export type Editor = {
  backingFileState: BackingFileState;
  codeText: string;
  codeTextSeqNum: number;
  backedSeqNum: number;
  setBackedSeqNum: Action<Editor, number>;
  setCodeText: Action<Editor, string>;
  updateCodeText: Action<Editor, string>;
  updateCodeTextAndScheduleSave: Thunk<Editor, string, {}, PyGgbModel>;
  setBackingFileState: Action<Editor, BackingFileState>;
  loadFromBacking: Thunk<Editor, UserFilePreview, {}, PyGgbModel>;
  maybeUpdateBacking: Thunk<Editor, CodeTextSnapshot, {}, PyGgbModel>;
};

const InitialCodeTextSeqNum = 1001;

export const editor: Editor = {
  backingFileState: { status: "booting" },
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

    a.setBackingFileState({ status: "loading", ...userFilePreview });
    const userFile = await db.userFiles.get(userFilePreview.id);
    if (userFile == null) {
      console.error(
        `could not get user-file ${JSON.stringify(userFilePreview)}`
      );
    } else {
      a.setCodeText(userFile.codeText);
      a.setBackedSeqNum(InitialCodeTextSeqNum);
    }
    a.setBackingFileState({ status: "idle", ...userFilePreview });
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
        const update = { id: backingFileState.id, codeText: snapshot.codeText };
        a.setBackingFileState({ ...backingFileState, status: "saving" });
        await db.updateFile(update);
        a.setBackingFileState({ ...backingFileState, status: "idle" });
        a.setBackedSeqNum(snapshot.seqNum);
        return;
    }
  }),
};
