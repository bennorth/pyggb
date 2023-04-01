import { AppApi } from "../shared/appApi";
import { register as registerPoint } from "./wrappings/point";
import { register as registerCircle } from "./wrappings/circle";
import { register as registerLine } from "./wrappings/line";
import { register as registerNumber } from "./wrappings/number";
import { register as registerBoolean } from "./wrappings/boolean";
import { register as registerVector } from "./wrappings/vector";

import { SkulptApi } from "./skulptapi";
declare var Sk: SkulptApi;

(globalThis as any).$skulptGgbModule = (appApi: AppApi) => {
  let mod = { __name__: new Sk.builtin.str("ggb") };

  registerPoint(mod, appApi);
  registerCircle(mod, appApi);
  registerLine(mod, appApi);
  registerNumber(mod, appApi);
  registerBoolean(mod, appApi);
  registerVector(mod, appApi);

  return mod;
};
