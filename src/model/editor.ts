import { action, Action } from "easy-peasy";

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
