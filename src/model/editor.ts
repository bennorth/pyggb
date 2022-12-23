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

export type Editor = {
  backingFileState: BackingFileState;
  codeText: string;
  codeTextSeqNum: number;
  backedSeqNum: number;
  setBackedSeqNum: Action<Editor, number>;
  setCodeText: Action<Editor, string>;
  updateCodeText: Action<Editor, string>;
  setBackingFileState: Action<Editor, BackingFileState>;
  loadFromBacking: Thunk<Editor, UserFilePreview, {}, PyGgbModel>;
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
};
