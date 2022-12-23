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
  setCodeText: Action<Editor, string>;
  setBackingFileState: Action<Editor, BackingFileState>;
};

export const editor: Editor = {
  backingFileState: { status: "booting" },
  codeText: "",
  setCodeText: action((s, codeText) => {
    s.codeText = codeText;
  }),
  setBackingFileState: action((s, state) => {
    s.backingFileState = state;
  }),
};
