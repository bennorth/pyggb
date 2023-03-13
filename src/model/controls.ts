import { Action, thunk, Thunk } from "easy-peasy";
import { runPythonProgram } from "../shared/skulpt-interaction";
import { PyGgbModel } from ".";
import { ModuleFilename, ModuleContents } from "../shared/skulpt-interaction";
import { propSetterAction } from "../shared/utils";

type ExecutionStatus = "idle" | "running";

export type Controls = {
  executionStatus: ExecutionStatus;
  setExecutionStatus: Action<Controls, ExecutionStatus>;
  runProgram: Thunk<Controls, void, {}, PyGgbModel>;
};

export const controls: Controls = {
  executionStatus: "idle",
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

    a.setExecutionStatus("running");
    await runPythonProgram(
      codeText,
      localModules,
      stdoutActions,
      errorActions,
      ggbApi
    );
    a.setExecutionStatus("idle");
  }),
};
