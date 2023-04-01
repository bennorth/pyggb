import { AppApi } from "../shared/appApi";

declare var Sk: any;

(globalThis as any).$skulptGgbModule = (appApi: AppApi) => {
  let mod = { __name__: new Sk.builtin.str("ggb") };

  return mod;
};
