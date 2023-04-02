const PYGGB_CYPRESS = () => {
  if (window.PYGGB_CYPRESS == null) window.PYGGB_CYPRESS = {};
  return window.PYGGB_CYPRESS;
};

function $builtinmodule() {
  const appApi = globalThis.$appApiHandoverQueue.dequeue();
  PYGGB_CYPRESS().GGB_API = appApi.ggb;
  return globalThis.$skulptGgbModule(appApi);
}
