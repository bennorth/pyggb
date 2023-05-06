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
    constructor: function Ellipse(
      this: SkGgbEllipse,
      spec: SkGgbEllipseCtorSpec
    ) {
      switch (spec.kind) {
        case "wrap-existing": {
          this.$ggbLabel = spec.label;
          break;
        }
        case "foci-semimajor-axis-length": {
          const focus1 = spec.focus1.$ggbLabel;
          const focus2 = spec.focus2.$ggbLabel;
          const smAxis = ggb.numberValueOrLabel(spec.semimajorAxis);
          const ggbCmd = `Ellipse(${focus1},${focus2},${smAxis})`;
          const ggbLbl = ggb.evalCmd(ggbCmd);
          this.$ggbLabel = ggbLbl;
          break;
        }
        case "foci-semimajor-axis-segment": {
          const focus1 = spec.focus1.$ggbLabel;
          const focus2 = spec.focus2.$ggbLabel;
          const smAxis = spec.semimajorAxis.$ggbLabel;
          const ggbCmd = `Ellipse(${focus1},${focus2},${smAxis})`;
          const ggbLbl = ggb.evalCmd(ggbCmd);
          this.$ggbLabel = ggbLbl;
          break;
        }
        case "foci-point": {
          const focus1 = spec.focus1.$ggbLabel;
          const focus2 = spec.focus2.$ggbLabel;
          const point = spec.point.$ggbLabel;
          const ggbCmd = `Ellipse(${focus1},${focus2},${point})`;
          const ggbLbl = ggb.evalCmd(ggbCmd);
          this.$ggbLabel = ggbLbl;
          break;
        }
        default:
          throw new Sk.builtin.RuntimeError(
            `bad Ellipse spec kind "${(spec as any).kind}"`
          );
      }
    },
  });

  mod.Ellipse = cls;
  registerObjectType("ellipse", cls);
};
