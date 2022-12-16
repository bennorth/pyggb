import { Editor, editor } from "./editor";
import { Dependencies, dependencies } from "./dependencies";

export type PyGgbModel = {
  editor: Editor;
  dependencies: Dependencies;
};

export const pyGgbModel: PyGgbModel = {
  editor,
  dependencies,
};
