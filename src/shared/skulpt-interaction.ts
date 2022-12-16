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
