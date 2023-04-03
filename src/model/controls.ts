import { Action, thunk, Thunk } from "easy-peasy";
import { runPythonProgram } from "../shared/skulpt-interaction";
import { PyGgbModel } from ".";
import { ModuleFilename, ModuleContents } from "../shared/skulpt-interaction";
import { propSetterAction } from "../shared/utils";

type ExecutionState = { state: "idle" } | { state: "running" };

export type Controls = {
  executionStatus: ExecutionState;
  setExecutionStatus: Action<Controls, ExecutionState>;
  runProgram: Thunk<Controls, void, {}, PyGgbModel>;
};

export const controls: Controls = {
  executionStatus: { state: "idle" },
  setExecutionStatus: propSetterAction("executionStatus"),

  runProgram: thunk(async (a, _voidPayload, helpers) => {
    const storeState = helpers.getStoreState();
    const actions = helpers.getStoreActions();
    const codeText = storeState.editor.codeText;
    const { ggbApi, ggbPythonModuleText } = storeState.dependencies;

    if (ggbApi === null) {
      console.error("runProgram() called without ggbApi");
      return;
    }
    if (ggbPythonModuleText === "") {
      console.error("runProgram() called without ggbPythonModuleText");
      return;
    }

    // The import machinery tries a few filenames.  We may as well
    // provide the content under the first one.
    const localModules = new Map<ModuleFilename, ModuleContents>([
      ["src/builtin/ggb.js", ggbPythonModuleText],
    ]);

    const stdoutActions = {
      clear: actions.pyStdout.clearContent,
      append: actions.pyStdout.appendContent,
    };

    const errorActions = {
      clear: actions.pyErrors.clearErrors,
      append: actions.pyErrors.appendError,
    };

    // This seems to have the side-effect that the "load/save" spinner
    // is visible while the program is running, or until the first
    // suspension point.  This is useful but it would be good to do it
    // more deliberately.
    await actions.editor.saveCodeText();

    a.setExecutionStatus({ state: "running" });
    await runPythonProgram(
      codeText,
      localModules,
      stdoutActions,
      errorActions,
      ggbApi
    );
    a.setExecutionStatus({ state: "idle" });
  }),
};
