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

interface SkGgbVector extends SkGgbObject {}

type SkGgbVectorCtorSpec =
  | WrapExistingCtorSpec
  | {
      kind: "points";
      point1: SkGgbObject;
      point2: SkGgbObject;
    }
  | {
      kind: "components";
      e1: SkObject;
      e2: SkObject;
    };

export const register = (mod: any, appApi: AppApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("Vector", {
    constructor: function Vector(this: SkGgbVector, spec: SkGgbVectorCtorSpec) {
      switch (spec.kind) {
        case "wrap-existing": {
          this.$ggbLabel = spec.label;
          break;
        }
        case "points": {
          const ggbArgs = `${spec.point1.$ggbLabel},${spec.point2.$ggbLabel}`;
          const ggbCmd = `Vector(${ggbArgs})`;
          const lbl = ggb.evalCmd(ggbCmd);
          this.$ggbLabel = lbl;
          break;
        }
        case "components": {
          const e1Arg = ggb.numberValueOrLabel(spec.e1);
          const e2Arg = ggb.numberValueOrLabel(spec.e2);
          const ggbArgs = `${e1Arg},${e2Arg}`;
          const ggbCmd = `Vector((${ggbArgs}))`;
          const lbl = ggb.evalCmd(ggbCmd);
          this.$ggbLabel = lbl;
          break;
        }
        default:
          throw new Sk.builtin.TypeError(
            `bad Vector() spec.kind "${(spec as any).kind}"`
          );
      }
    },
    slots: {
      tp$new(args, kwargs) {
        const badArgsError = new Sk.builtin.TypeError(
          "Vector() arguments must be" +
            " (start_point, end_point) or (x_component, y_component)"
        );

        const make = (spec: SkGgbVectorCtorSpec) =>
          withPropertiesFromNameValuePairs(new mod.Vector(spec), kwargs);

        switch (args.length) {
          case 2: {
            if (ggb.everyElementIsGgbObjectOfType(args, "point")) {
              return make({ kind: "points", point1: args[0], point2: args[1] });
            }
            if (args.every(ggb.isPythonOrGgbNumber)) {
              return make({ kind: "components", e1: args[0], e2: args[1] });
            }

            throw badArgsError;
          }
          default:
            throw badArgsError;
        }
      },

      // ...sharedOpSlots,
    },
    methods: {
      ...ggb.withPropertiesMethodsSlice,
      ...ggb.freeCopyMethodsSlice,
    },
    getsets: {
      is_visible: ggb.sharedGetSets.is_visible,
      is_independent: ggb.sharedGetSets.is_independent,
      color: ggb.sharedGetSets.color,
      color_floats: ggb.sharedGetSets.color_floats,
      line_thickness: ggb.sharedGetSets.line_thickness,
      _ggb_type: ggb.sharedGetSets._ggb_type,
    },
  });

  mod.Vector = cls;
  registerObjectType("vector", cls);
};
