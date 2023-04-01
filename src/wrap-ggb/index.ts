import { AppApi } from "../shared/appApi";

import { SkulptApi } from "./skulptapi";
declare var Sk: SkulptApi;

(globalThis as any).$skulptGgbModule = (appApi: AppApi) => {
  let mod = { __name__: new Sk.builtin.str("ggb") };

  return mod;
};
