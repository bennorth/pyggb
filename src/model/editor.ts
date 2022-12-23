import { action, Action } from "easy-peasy";

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
};
