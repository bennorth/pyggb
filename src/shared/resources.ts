export const SkulptGgbModuleUrl = (() => {
  const prefixIsNonEmpty = process.env.PUBLIC_URL !== "";
  const maybeSeparator = prefixIsNonEmpty ? "/" : "";
  return process.env.PUBLIC_URL + maybeSeparator + "skulpt-ggb.js";
})();
