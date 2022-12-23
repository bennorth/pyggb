import { thunk, Thunk } from "easy-peasy";
import { runPythonProgram } from "../shared/skulpt-interaction";
import { PyGgbModel } from ".";
import { ModuleFilename, ModuleContents } from "../shared/skulpt-interaction";

export type Controls = {
  runProgram: Thunk<Controls, void, {}, PyGgbModel>;
};

export const controls: Controls = {
  runProgram: thunk((a, _voidPayload, helpers) => {
    const state = helpers.getStoreState();
    const codeText = state.editor.codeText;
    const { ggbApi, ggbPythonModuleText } = state.dependencies;

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

    // TODO: Make async, add "await" to following, and wrap it in
    // setState("running") / setState("idle") calls.  Or just use
    // "then()" calls.
    runPythonProgram(codeText, localModules, ggbApi).then(() => {
      console.log("runPythonProgram done");
    });
  }),
};