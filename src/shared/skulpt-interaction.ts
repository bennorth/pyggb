declare var Sk: any;

const builtinRead = (filename: string) => {
  console.log(`builtinRead("${filename}")`);

  if (
    Sk.builtinFiles === undefined ||
    Sk.builtinFiles["files"][filename] === undefined
  )
    throw `File not found: "${filename}"`;

  return Sk.builtinFiles["files"][filename];
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
