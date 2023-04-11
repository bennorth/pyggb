import { AppApi } from "../../shared/appApi";
import { augmentedGgbApi, SkGgbObject, WrapExistingCtorSpec } from "../shared";
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
        default:
          throw new Sk.builtin.RuntimeError("Point(): Bad ctor args");
      }
    },
    slots: {
      tp$new(args, _kwargs) {
        const spec: SkGgbLineCtorSpec = (() => {
          if (args.length !== 2) {
            throw new Sk.builtin.TypeError("bad Line() args; need 2 args");
          }

          if (!Sk.builtin.isinstance(args[0], mod.Point).v) {
            throw new Sk.builtin.TypeError("bad Line() args; first not Point");
          }

          if (Sk.builtin.isinstance(args[1], mod.Point).v) {
            const points = [args[0] as SkGgbObject, args[1] as SkGgbObject];
            return { kind: "point-point", points };
          }

          throw new Sk.builtin.TypeError(
            "bad Line() args; unhandled type of second"
          );
        })();
        return new mod.Line(spec);
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
    },
  });

  mod.Line = cls;
  registerObjectType("line", cls);
};
