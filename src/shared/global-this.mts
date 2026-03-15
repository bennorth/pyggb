import { AppApi, AppApiHandoverQueue } from "./appApi";
import { GgbApi } from "./vendor-types/ggbapi";

/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  var $appApiHandoverQueue: AppApiHandoverQueue;
  var $skulptGgbModule: (appApi: AppApi) => any;
  var $hexRgbFromNamedColour: Map<string, string>;
  var ggbApplet: GgbApi;
}
