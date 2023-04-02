import { AppApi } from "../shared/appApi";
import { register as registerPoint } from "./wrappings/point";
import { register as registerCircle } from "./wrappings/circle";
import { register as registerLine } from "./wrappings/line";
import { register as registerNumber } from "./wrappings/number";
import { register as registerBoolean } from "./wrappings/boolean";
import { register as registerVector } from "./wrappings/vector";
import { register as registerSegment } from "./wrappings/segment";
import { register as registerParabola } from "./wrappings/parabola";
import { register as registerPolygon } from "./wrappings/polygon";
import { register as registerRotate } from "./wrappings/rotate";
import { register as registerFunction } from "./wrappings/function";
import { register as registerIf } from "./wrappings/if";
import { register as registerDistance } from "./wrappings/distance";
import { register as registerIntersect } from "./wrappings/intersect";

import { register as registerClearConsole } from "./app-ui/clear-console";

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
  registerSegment(mod, appApi);
  registerParabola(mod, appApi);
  registerPolygon(mod, appApi);
  registerRotate(mod, appApi);
  registerFunction(mod, appApi);
  registerIf(mod, appApi);
  registerDistance(mod, appApi);
  registerIntersect(mod, appApi);

  registerClearConsole(mod, appApi);

  return mod;
};
