import { AppApi } from "../../shared/appApi";
import {
  augmentedGgbApi,
  isInstance,
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
        case "wrap-existing":
          this.$ggbLabel = spec.label;
          break;
        default:
          throw new Sk.builtin.TypeError(
            `bad Vector() spec.kind "${(spec as any).kind}"`
          );
      }
    },
    slots: {
      tp$new(args, kwargs) {
        const rawVector = (() => {
          if (args.length === 2 && args.every(isInstance(mod.Point))) {
            const spec = { kind: "points", point1: args[0], point2: args[1] };
            return new mod.Vector(spec);
          }

          if (args.length === 2 && args.every(ggb.isPythonOrGgbNumber)) {
            const spec = { kind: "components", e1: args[0], e2: args[1] };
            return new mod.Vector(spec);
          }

          throw new Sk.builtin.TypeError(
            "bad Vector() args: need 2 Points or 2 numbers"
          );
        })();

        return withPropertiesFromNameValuePairs(rawVector, kwargs);
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
      color_ints: ggb.sharedGetSets.color_ints,
      color_floats: ggb.sharedGetSets.color_floats,
      line_thickness: ggb.sharedGetSets.line_thickness,
    },
  });

  mod.Vector = cls;
  registerObjectType("vector", cls);
};
