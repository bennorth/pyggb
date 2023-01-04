import { GgbApi } from "./ggb-interaction";

declare var Sk: any;

export type ModuleFilename = string;
export type ModuleContents = string;
export type LocalModules = Map<ModuleFilename, ModuleContents>;

const builtinOrLocalRead =
  (localModules: LocalModules) => (filename: string) => {
    if (
      Sk.builtinFiles !== undefined &&
      Sk.builtinFiles["files"][filename] !== undefined
    )
      return Sk.builtinFiles["files"][filename];

    if (localModules.has(filename)) return localModules.get(filename);

    throw new Error(`File not found: "${filename}"`);
  };

export interface StdoutActions {
  clear: () => void;
  append: (newOutput: string) => void;
}

export const runPythonProgram = (
  userCodeText: string,
  localModules: LocalModules,
  stdoutActions: StdoutActions,
  ggbApi: GgbApi
) => {
  Sk.configure({
    output: stdoutActions.append,
    read: builtinOrLocalRead(localModules),
    __future__: Sk.python3,
    inputfun: (promptText: string) => prompt(promptText),
    inputfunTakesPrompt: true /* then you need to output the prompt yourself */,
  });

  stdoutActions.clear();
  ggbApi.reset();
  (globalThis as any).$ggbApiHandoverQueue.enqueue(ggbApi);

  return Sk.misceval.asyncToPromise(() =>
    Sk.importMainWithBody("<stdin>", false, userCodeText, true)
  );
};
