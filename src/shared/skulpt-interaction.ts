import { SkulptInteractionApi, AppApi, UiApi, HidApi } from "./appApi";
import { GgbApi } from "./vendor-types/ggbapi";
import { RunControlClient } from "../wrap-ggb/interruptible-sleep";
import {
  SkBaseException,
  SkulptApi,
  augmentedSkulptApi,
} from "./vendor-types/skulptapi";

declare var Sk: SkulptApi;

export type ModuleFilename = string;
export type ModuleContents = string;
export type LocalModules = Map<ModuleFilename, ModuleContents>;

export const messageOfPyError = (err: SkBaseException) => {
  if (err.tp$name == null) {
    return `[Internal error: ${err}]`;
  }

  let message = err.tp$name;
  if (err.args && err.args.v.length > 0) {
    const arg0 = err.args.v[0];
    const extra = augmentedSkulptApi.checkString(arg0)
      ? arg0.v
      : "(no more information)";
    message += ": " + extra;
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
  append: (newError: SkBaseException) => void;
}

export const runPythonProgram = (
  userCodeText: string,
  localModules: LocalModules,
  stdoutActions: StdoutActions,
  errorActions: ErrorActions,
  hidApi: HidApi,
  runControlClient: RunControlClient,
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
  hidApi.clearRegistration();

  // TODO: Seems a bit clunky to reuse errorActions and stdoutActions
  // like this.  Revisit?
  const skApi: SkulptInteractionApi = {
    onError: (e) => errorActions.append(e),
  };
  const uiApi: UiApi = {
    clearConsole: () => stdoutActions.clear(),
    runControlClient: runControlClient,
  };
  const appApi: AppApi = { ggb: ggbApi, sk: skApi, ui: uiApi, hid: hidApi };
  (globalThis as any).$appApiHandoverQueue.enqueue(appApi);

  const handleError = (e: any) => errorActions.append(e);

  const codePreambleLines = [
    "from ggb import *",
    "import time",
    "time.sleep = interruptible_sleep",
    "del time",
  ];
  const codePreamble = codePreambleLines.join("\n") + "\n";
  const codeText = codePreamble + userCodeText;

  return Sk.misceval
    .asyncToPromise(() =>
      Sk.importMainWithBody("<stdin>", false, codeText, true)
    )
    .catch(handleError);
};
