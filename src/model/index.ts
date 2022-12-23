import { Editor, editor } from "./editor";
import { Controls, controls } from "./controls";
import { PyStdout, pyStdout } from "./pystdout";
import { Dependencies, dependencies } from "./dependencies";

export type PyGgbModel = {
  editor: Editor;
  controls: Controls;
  pyStdout: PyStdout;
  dependencies: Dependencies;
};

export const pyGgbModel: PyGgbModel = {
  editor,
  controls,
  pyStdout,
  dependencies,
};
