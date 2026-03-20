import { RegisterFun } from "../../shared/appApi";
import {
  augmentedGgbApi,
  kPolygonTypeAndSubtypes,
  setGgbLabelFromArgs,
  SkGgbObject,
  WrapExistingCtorSpec,
} from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";
import { registerObjectType } from "../type-registry";
import { throwBadSpecKind } from "../../shared/utils";

declare var Sk: SkulptApi; // eslint-disable-line no-var

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SkGgbAngle extends SkGgbObject {}

type Arr3GgbObjects = [SkGgbObject, SkGgbObject, SkGgbObject];

type SkGgbAngleCtorSpec =
  | WrapExistingCtorSpec
  | {
      kind: "one-object"; // handle polygon in Polygon.angles()
      obj: SkGgbObject; // point, vector, line, number
    }
  | {
      kind: "two-line-like";
      obj1: SkGgbObject; // line or vector (same as next)
      obj2: SkGgbObject; // line or vector
    }
  | {
      kind: "three-points";
      points: Arr3GgbObjects; // points
    };

export const register: RegisterFun = (mod, appApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);
  const isObjOfType = ggb.isGgbObjectOfSomeType;
  const everyObjOfType = ggb.everyElementIsGgbObjectOfType;

  const cls = Sk.abstr.buildNativeClass("Angle", {
    constructor: function Angle(this: SkGgbAngle, spec: SkGgbAngleCtorSpec) {
      const setLabelArgs = setGgbLabelFromArgs(ggb, this, "Angle");

      switch (spec.kind) {
        case "wrap-existing": {
          this.$ggbLabel = spec.label;
          break;
        }
        case "one-object": {
          setLabelArgs([spec.obj.$ggbLabel]);
          break;
        }
        case "two-line-like": {
          setLabelArgs([spec.obj1.$ggbLabel, spec.obj2.$ggbLabel]);
          break;
        }
        case "three-points": {
          setLabelArgs(spec.points.map((p) => p.$ggbLabel));
          break;
        }
        default:
          throwBadSpecKind("Angle", spec);
      }
    },
    slots: {
      tp$new(args) {
        const mkBadArgsError = (suffix: string) =>
          new Sk.builtin.TypeError(
            "Angle() arguments must be" +
              " (object) or (line, line), or (vector, vector)" +
              suffix
          );

        const badArgsError = mkBadArgsError("");
        const badArgsTryPolygonAngleError = mkBadArgsError(
          "; you might be looking for the angles() method" +
            " on a Polygon instance"
        );

        const make = (spec: SkGgbAngleCtorSpec) => new mod.Angle(spec);

        switch (args.length) {
          case 1: {
            const obj = args[0];

            if (!isObjOfType(obj, ["point", "vector", "numeric"]))
              throw isObjOfType(obj, kPolygonTypeAndSubtypes)
                ? badArgsTryPolygonAngleError
                : badArgsError;

            return make({ kind: "one-object", obj });
          }
          case 2: {
            const bothLines = everyObjOfType(args, "line");
            const bothVectors = everyObjOfType(args, "vector");
            if (!(bothLines || bothVectors)) {
              throw badArgsError;
            }

            return make({
              kind: "two-line-like",
              obj1: args[0],
              obj2: args[1],
            });
          }
          case 3: {
            if (!everyObjOfType(args, "point")) {
              throw badArgsError;
            }
            // Need "as"; TypeScript doesn't infer length of args.
            return make({
              kind: "three-points",
              points: args as [SkGgbObject, SkGgbObject, SkGgbObject],
            });
          }

          default:
            throw badArgsError;
        }
      },
    },
    methods: {
      ...ggb.withPropertiesMethodsSlice,
    },
    getsets: {
      value: ggb.sharedGetSets.value,
      is_visible: ggb.sharedGetSets.is_visible,
      color: ggb.sharedGetSets.color,
      color_floats: ggb.sharedGetSets.color_floats,
      opacity: ggb.sharedGetSets.opacity,
      _ggb_label: ggb.sharedGetSets._ggb_label,
      _ggb_type: ggb.sharedGetSets._ggb_type,
    },
  });

  mod.Angle = cls;
  registerObjectType("angle", cls);
};
