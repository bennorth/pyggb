import { Editor, editor } from "./editor";
import { Controls, controls } from "./controls";
import { PyStdout, pyStdout } from "./pystdout";
import { Dependencies, dependencies } from "./dependencies";
import { Modals, modals } from "./modals";
import { PyErrors, pyErrors } from "./pyerrors";
import { WebHid, webHid } from "./web-hid";
import { uiSettings, UiSettings } from "./ui";

export type PyGgbModel = {
  editor: Editor;
  controls: Controls;
  pyStdout: PyStdout;
  pyErrors: PyErrors;
  webHid: WebHid;
  dependencies: Dependencies;
  modals: Modals;
  uiSettings: UiSettings;
};

export const pyGgbModel: PyGgbModel = {
  editor,
  controls,
  pyStdout,
  pyErrors,
  webHid,
  dependencies,
  modals,
  uiSettings,
};
