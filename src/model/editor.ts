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
  setCodeText: Action<Editor, string>;
  setBackingFileState: Action<Editor, BackingFileState>;
};

const InitialCodeTextSeqNum = 1001;

export const editor: Editor = {
  backingFileState: { status: "booting" },
  codeText: "",
  codeTextSeqNum: 0,
  setCodeText: action((s, codeText) => {
    s.codeText = codeText;
    s.codeTextSeqNum = InitialCodeTextSeqNum;
  }),
  setBackingFileState: action((s, state) => {
    s.backingFileState = state;
  }),
};
