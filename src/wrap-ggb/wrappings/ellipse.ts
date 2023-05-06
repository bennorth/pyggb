import { AppApi } from "../../shared/appApi";
import {
  augmentedGgbApi,
  withPropertiesFromNameValuePairs,
  WrapExistingCtorSpec,
  SkGgbObject,
} from "../shared";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";
import { registerObjectType } from "../type-registry";

declare var Sk: SkulptApi;

interface SkGgbEllipse extends SkGgbObject {
  // TODO: Anything here?
}

type SkGgbEllipseCtorSpec =
  | WrapExistingCtorSpec
  | {
      kind: "foci-semimajor-axis-length";
      focus1: SkGgbObject;
      focus2: SkGgbObject;
      semimajorAxis: SkObject;
    }
  | {
      kind: "foci-semimajor-axis-segment";
      focus1: SkGgbObject;
      focus2: SkGgbObject;
      semimajorAxis: SkGgbObject;
    }
  | {
      kind: "foci-point";
      focus1: SkGgbObject;
      focus2: SkGgbObject;
      point: SkGgbObject;
    };

export const register = (mod: any, appApi: AppApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("Ellipse", {
    // TODO
  });

  mod.Ellipse = cls;
  registerObjectType("ellipse", cls);
};
