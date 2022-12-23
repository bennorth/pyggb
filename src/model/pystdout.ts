import { action, Action } from "easy-peasy";

export type PyStdout = {
  content: string;
  appendContent: Action<PyStdout, string>;
  clearContent: Action<PyStdout>;
};

export const pyStdout: PyStdout = {
  content: "",
  appendContent: action((s, newContent) => {
    s.content += newContent;
  }),
  clearContent: action((s) => {
    s.content = "";
  }),
};
