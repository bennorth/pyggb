import { AppApi } from "../shared/appApi";
import { register as registerPoint } from "./wrappings/point";
import { register as registerCircle } from "./wrappings/circle";
import { register as registerEllipse } from "./wrappings/ellipse";
import { register as registerAngle } from "./wrappings/angle";
import { register as registerArc } from "./wrappings/arc";
import { register as registerLine } from "./wrappings/line";
import { register as registerList } from "./wrappings/list";
import { register as registerNumber } from "./wrappings/number";
import { register as registerBoolean } from "./wrappings/boolean";
import { register as registerVector } from "./wrappings/vector";
import { register as registerSegment } from "./wrappings/segment";
import { register as registerParabola } from "./wrappings/parabola";
import { register as registerPolygon } from "./wrappings/polygon";
import { register as registerSlider } from "./wrappings/slider";
import { register as registerRotate } from "./wrappings/rotate";
import { register as registerFunction } from "./wrappings/function";
import { register as registerFunctionGraph } from "./wrappings/function-graph";
import { register as registerIf } from "./wrappings/if";
import { register as registerDistance } from "./wrappings/distance";
import { register as registerIntersect } from "./wrappings/intersect";
import { register as registerZoom } from "./wrappings/zoom";
import { register as registerNumberOfObjects } from "./wrappings/number-of-objects";
import { register as registerAngleBisector } from "./wrappings/angle-bisector";
import { register as registerCentroid } from "./wrappings/centroid";
import { register as registerIncircle } from "./wrappings/incircle";
import { register as registerMidpoint } from "./wrappings/midpoint";
import { register as registerPerpendicularBisector } from "./wrappings/perpendicular-bisector";
import { register as registerPerpendicularLine } from "./wrappings/perpendicular-line";
import { register as registerCircumference } from "./wrappings/circumference";
import { register as registerPerimeter } from "./wrappings/perimeter";
import { register as registerArea } from "./wrappings/area";
import { register as registerPredicates } from "./wrappings/predicates";
import { register as registerTangent } from "./wrappings/tangent";
import { register as registerTriangleCenter } from "./wrappings/triangle-center";

import { register as registerClearConsole } from "./app-ui/clear-console";

import { register as registerOnTemperatureReport } from "./web-hid/on-temperature-report";

import { register as registerInterruptibleSleep } from "./interruptible-sleep";

import { SkulptApi } from "../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi; // eslint-disable-line no-var

globalThis.$skulptGgbModule = (appApi: AppApi) => {
  // For ease of debugging:
  globalThis.ggbApplet = appApi.ggb;

  // This object gets built up in stages, and each register() function
  // expects a different type, so fudge it.  Perhaps there's a better
  // way to do this?
  //
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mod = { __name__: new Sk.builtin.str("ggb") } as any;

  registerPoint(mod, appApi);
  registerCircle(mod, appApi);
  registerEllipse(mod, appApi);
  registerAngle(mod, appApi);
  registerArc(mod, appApi);
  registerLine(mod, appApi);
  registerList(mod, appApi);
  registerNumber(mod, appApi);
  registerBoolean(mod, appApi);
  registerVector(mod, appApi);
  registerSegment(mod, appApi);
  registerParabola(mod, appApi);
  registerPolygon(mod, appApi);
  registerSlider(mod, appApi);
  registerRotate(mod, appApi);
  registerFunction(mod, appApi);
  registerFunctionGraph(mod, appApi);
  registerIf(mod, appApi);
  registerDistance(mod, appApi);
  registerIntersect(mod, appApi);
  registerZoom(mod, appApi);
  registerNumberOfObjects(mod, appApi);
  registerAngleBisector(mod, appApi);
  registerCentroid(mod, appApi);
  registerIncircle(mod, appApi);
  registerMidpoint(mod, appApi);
  registerPerpendicularBisector(mod, appApi);
  registerPerpendicularLine(mod, appApi);
  registerCircumference(mod, appApi);
  registerPerimeter(mod, appApi);
  registerArea(mod, appApi);
  registerPredicates(mod, appApi);
  registerTangent(mod, appApi);
  registerTriangleCenter(mod, appApi);

  registerClearConsole(mod, appApi);

  registerOnTemperatureReport(mod, appApi);

  registerInterruptibleSleep(mod, appApi);

  return mod;
};
