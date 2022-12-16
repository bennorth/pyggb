import { Editor, editor } from "./editor";
import { Controls, controls } from "./controls";
import { Dependencies, dependencies } from "./dependencies";

export type PyGgbModel = {
  editor: Editor;
  controls: Controls;
  dependencies: Dependencies;
};

export const pyGgbModel: PyGgbModel = {
  editor,
  controls,
  dependencies,
};
