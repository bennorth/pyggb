import { AppApi } from "../shared/appApi";
import { register as registerPoint } from "./wrappings/point";

import { SkulptApi } from "./skulptapi";
declare var Sk: SkulptApi;

(globalThis as any).$skulptGgbModule = (appApi: AppApi) => {
  let mod = { __name__: new Sk.builtin.str("ggb") };

  registerPoint(mod, appApi);

  return mod;
};
