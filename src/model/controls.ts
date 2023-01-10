import { thunk, Thunk } from "easy-peasy";
import { runPythonProgram } from "../shared/skulpt-interaction";
import { PyGgbModel } from ".";
import { ModuleFilename, ModuleContents } from "../shared/skulpt-interaction";

export type Controls = {
  runProgram: Thunk<Controls, void, {}, PyGgbModel>;
};

export const controls: Controls = {
  runProgram: thunk((a, _voidPayload, helpers) => {
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

    // TODO: Make async, add "await" to following, and wrap it in
    // setState("running") / setState("idle") calls.  Or just use
    // "then()" calls.
    runPythonProgram(
      codeText,
      localModules,
      stdoutActions,
      ggbApi
    );
  }),
};
