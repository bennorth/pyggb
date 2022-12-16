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

export const runPythonProgram = (codeText: string) => {
  Sk.configure({
    output: (s: string) => console.log(s),
    read: builtinRead,
    __future__: Sk.python3,
    inputfun: (promptText: string) => prompt(promptText),
    inputfunTakesPrompt: true /* then you need to output the prompt yourself */,
  });

  Sk.misceval.asyncToPromise(function () {
    return Sk.importMainWithBody("<stdin>", false, codeText, true);
  });
};
