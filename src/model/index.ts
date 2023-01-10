import { Editor, editor } from "./editor";
import { Controls, controls } from "./controls";
import { PyStdout, pyStdout } from "./pystdout";
import { Dependencies, dependencies } from "./dependencies";
import { Modals, modals } from "./modals";
import { PyErrors, pyErrors } from "./pyerrors";

export type PyGgbModel = {
  editor: Editor;
  controls: Controls;
  pyStdout: PyStdout;
  pyErrors: PyErrors;
  dependencies: Dependencies;
  modals: Modals;
};

export const pyGgbModel: PyGgbModel = {
  editor,
  controls,
  pyStdout,
  pyErrors,
  dependencies,
  modals,
};
