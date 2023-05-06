import { AppApi } from "../../shared/appApi";
import {
  augmentedGgbApi,
  WrapExistingCtorSpec,
  SkGgbObject,
  AugmentedGgbApi,
  withPropertiesFromNameValuePairs,
} from "../shared";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";
import { registerObjectType } from "../type-registry";

declare var Sk: SkulptApi;

interface SkGgbParabola extends SkGgbObject {
  focus: SkGgbObject;
  directrix: SkGgbObject;
}

type SkGgbParabolaCtorSpec =
  | WrapExistingCtorSpec
  | {
      kind: "focus-directrix";
      focus: SkGgbObject;
      directrix: SkGgbObject;
    }
  | {
      kind: "coefficients";
      coeffs: [SkObject, SkObject, SkObject];
    };

export const register = (mod: any, appApi: AppApi) => {
  const ggb: AugmentedGgbApi = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("Parabola", {
    constructor: function Parabola(
      this: SkGgbParabola,
      spec: SkGgbParabolaCtorSpec
    ) {
      switch (spec.kind) {
        case "wrap-existing": {
          this.$ggbLabel = spec.label;
          break;
        }
        case "focus-directrix": {
          const ggbArgs = `${spec.focus.$ggbLabel},${spec.directrix.$ggbLabel}`;
          const ggbCmd = `Parabola(${ggbArgs})`;
          const lbl = ggb.evalCmd(ggbCmd);
          this.$ggbLabel = lbl;
          this.focus = spec.focus;
          this.directrix = spec.directrix;
          console.log("Made Parabola?", lbl, spec);
          break;
        }
        case "coefficients": {
          const ggbCoeffs = spec.coeffs.map(ggb.numberValueOrLabel);
          const ggbCmd = `y=(${ggbCoeffs[0]})x^2 + (${ggbCoeffs[1]})x + (${ggbCoeffs[2]})`;
          const lbl = ggb.evalCmd(ggbCmd);
          this.$ggbLabel = lbl;
          // TODO: Set focus and directrix?
          break;
        }
        default:
          throw new Sk.builtin.RuntimeError(
            `bad Parabola spec.kind "${(spec as any).kind}"`
          );
      }
    },
    slots: {
      tp$new(args, kwargs) {
        const badArgsError = new Sk.builtin.TypeError(
          "Parabola() arguments must be" +
            " (focus_point, directrix_line)" +
            " or (x_squared_coefficient, x_coefficient, constant)"
        );

        const make = (spec: SkGgbParabolaCtorSpec) =>
          withPropertiesFromNameValuePairs(new mod.Parabola(spec), kwargs);

        switch (args.length) {
          case 2: {
            if (
              ggb.isGgbObjectOfType(args[0], "point") &&
              ggb.isGgbObjectOfType(args[1], "line")
            ) {
              return make({
                kind: "focus-directrix",
                focus: args[0],
                directrix: args[1],
              });
            }

            throw badArgsError;
          }
          case 3: {
            if (args.every(ggb.isPythonOrGgbNumber)) {
              // We know that args is a three-element array of
              // SkObjects, but TypeScript can't yet work that out.
              return make({
                kind: "coefficients",
                coeffs: args as [SkObject, SkObject, SkObject],
              });
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
      color_floats: ggb.sharedGetSets.color_floats,
      line_thickness: ggb.sharedGetSets.line_thickness,
      _ggb_type: ggb.sharedGetSets._ggb_type,
    },
  });
  mod.Parabola = cls;
  registerObjectType("parabola", cls);
};
