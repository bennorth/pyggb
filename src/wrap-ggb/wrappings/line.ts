import { AppApi } from "../../shared/appApi";
import {
  augmentedGgbApi,
  SkGgbObject,
  WrapExistingCtorSpec,
} from "../shared";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";

import { registerObjectType } from "../type-registry";

declare var Sk: SkulptApi;

interface SkGgbLine extends SkGgbObject {}

type SkGgbLineCtorSpec =
  | WrapExistingCtorSpec
  | { kind: "point-point"; points: Array<SkGgbObject> }
  | { kind: "coefficients"; coeffs: [SkObject, SkObject] };

export const register = (mod: any, appApi: AppApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("Line", {
    constructor: function Line(this: SkGgbLine, spec: SkGgbLineCtorSpec) {
      switch (spec.kind) {
        case "wrap-existing": {
          this.$ggbLabel = spec.label;
          return;
        }
        case "point-point": {
          const ggbArgs = spec.points.map((p) => p.$ggbLabel).join(",");
          const ggbCmd = `Line(${ggbArgs})`;
          const lbl = ggb.evalCmd(ggbCmd);
          this.$ggbLabel = lbl;
          return;
        }
        case "coefficients": {
          const ggbCoeffs = spec.coeffs.map(ggb.numberValueOrLabel);
          const ggbCmd = `y=(${ggbCoeffs[0]})x + (${ggbCoeffs[1]})`;
          const lbl = ggb.evalCmd(ggbCmd);
          this.$ggbLabel = lbl;
          return;
        }
        default:
          throw new Sk.builtin.RuntimeError("Point(): Bad ctor args");
      }
    },
    slots: {
      tp$new(args, _kwargs) {
        const badArgsError = new Sk.builtin.TypeError(
          "Line() arguments must be (point, point) or (slope, intercept)"
        );

        switch (args.length) {
          case 2: {
            if (ggb.everyElementIsGgbObjectOfType(args, "point")) {
              return new mod.Line({ kind: "point-point", points: args });
            }

            if (args.every(ggb.isPythonOrGgbNumber)) {
              return new mod.Line({ kind: "coefficients", coeffs: args });
            }

            throw badArgsError;
          }
          default:
            throw badArgsError;
        }
      },
    },
    methods: {
      ...ggb.freeCopyMethodsSlice,
    },
    getsets: {
      color: ggb.sharedGetSets.color,
      color_ints: ggb.sharedGetSets.color_ints,
      color_floats: ggb.sharedGetSets.color_floats,
      line_thickness: ggb.sharedGetSets.line_thickness,
      _ggb_type: ggb.sharedGetSets._ggb_type,
    },
  });

  mod.Line = cls;
  registerObjectType("line", cls);
};
