import { GgbApi, SkulptInteractionApi, AppApi, PyError, UiApi } from "./appApi";

declare var Sk: any;

export type ModuleFilename = string;
export type ModuleContents = string;
export type LocalModules = Map<ModuleFilename, ModuleContents>;

export const messageOfPyError = (err: PyError) => {
  if (err.tp$name == null) {
    return `[Internal error: ${err}]`;
  }

  let message = err.tp$name;
  if (err.args && err.args.v.length > 0) {
    message += ": " + err.args.v[0].v;
  }

  return message;
};

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

export interface ErrorActions {
  clear: () => void;
  append: (newError: PyError) => void;
}

export const runPythonProgram = (
  userCodeText: string,
  localModules: LocalModules,
  stdoutActions: StdoutActions,
  errorActions: ErrorActions,
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
  errorActions.clear();
  ggbApi.reset();

  // TODO: Seems a bit clunky to reuse errorActions and stdoutActions
  // like this.  Revisit?
  const skApi: SkulptInteractionApi = {
    onError: (e) => errorActions.append(e),
  };
  const uiApi: UiApi = { clearConsole: () => stdoutActions.clear() };
  const appApi: AppApi = { ggb: ggbApi, sk: skApi, ui: uiApi };
  (globalThis as any).$appApiHandoverQueue.enqueue(appApi);

  const handleError = (e: any) => errorActions.append(e);

  const codeText = "from ggb import *\n\n" + userCodeText;

  return Sk.misceval
    .asyncToPromise(() =>
      Sk.importMainWithBody("<stdin>", false, codeText, true)
    )
    .catch(handleError);
};
