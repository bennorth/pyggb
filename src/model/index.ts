import { Editor, editor } from "./editor";
import { Controls, controls } from "./controls";
import { PyStdout, pyStdout } from "./pystdout";
import { Dependencies, dependencies } from "./dependencies";
import { Modals, modals } from "./modals";

export type PyGgbModel = {
  editor: Editor;
  controls: Controls;
  pyStdout: PyStdout;
  dependencies: Dependencies;
  modals: Modals;
};

export const pyGgbModel: PyGgbModel = {
  editor,
  controls,
  pyStdout,
  dependencies,
  modals,
};
