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
  codeText: string;
  setCodeText: Action<Editor, string>;
};

export const editor: Editor = {
  codeText: "",
  setCodeText: action((s, codeText) => {
    s.codeText = codeText;
  }),
};
