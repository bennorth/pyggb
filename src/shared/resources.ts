// TODO: Is this the best place for the following type definition?
export type ExampleProgramPreview = {
  path: string;
  name: string;
  docMarkdown: string;
};

export const SkulptGgbModuleUrl = (() => {
  const prefixIsNonEmpty = process.env.PUBLIC_URL !== "";
  const maybeSeparator = prefixIsNonEmpty ? "/" : "";
  return process.env.PUBLIC_URL + maybeSeparator + "skulpt-ggb.js";
})();
