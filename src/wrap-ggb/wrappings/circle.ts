import { AppApi } from "../../shared/appApi";
import {
  augmentedGgbApi,
  withPropertiesFromNameValuePairs,
  WrapExistingCtorSpec,
  SkGgbObject,
  setGgbLabelFromArgs,
} from "../shared";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";
import { registerObjectType } from "../type-registry";

declare var Sk: SkulptApi;

interface SkGgbCircle extends SkGgbObject {
  radiusNumber: any; // TODO: SkGgbNumber | null ??
  $radiusNumber: (this: SkGgbCircle) => any;
}

type SkGgbCircleCtorSpec =
  | WrapExistingCtorSpec
  | {
      kind: "center-radius";
      center: SkGgbObject;
      radius: SkObject;
    }
  | {
      kind: "center-point";
      center: SkGgbObject;
      point: SkGgbObject;
    }
  | {
      kind: "three-points";
      points: Array<SkGgbObject>;
    };

export const register = (mod: any, appApi: AppApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("Circle", {
    constructor: function Circle(this: SkGgbCircle, spec: SkGgbCircleCtorSpec) {
      this.radiusNumber = null;

      const setLabelArgs = setGgbLabelFromArgs(ggb, this, "Circle");

      switch (spec.kind) {
        case "wrap-existing": {
          this.$ggbLabel = spec.label;
          break;
        }
        case "center-radius": {
          const radiusArg = ggb.numberValueOrLabel(spec.radius);
          setLabelArgs([spec.center.$ggbLabel, radiusArg]);
          break;
        }
        case "center-point": {
          setLabelArgs([spec.center.$ggbLabel, spec.point.$ggbLabel]);
          break;
        }
        case "three-points": {
          setLabelArgs(spec.points.map((p) => p.$ggbLabel));
          break;
        }
        default:
          throw new Sk.builtin.RuntimeError(
            `bad Circle spec kind "${(spec as any).kind}"`
          );
      }
    },
    proto: {
      $radiusNumber(this: SkGgbCircle) {
        if (this.radiusNumber == null) {
          const ggbCmd = `Radius(${this.$ggbLabel})`;
          const label = ggb.evalCmd(ggbCmd);
          this.radiusNumber = new mod.Number({ kind: "wrap-existing", label });
        }
        return this.radiusNumber;
      },
    },
    slots: {
      tp$new(args, kwargs) {
        const badArgsError = new Sk.builtin.TypeError(
          "Circle() arguments must be" +
            " (center_point, number), (center_point, circumference_point)" +
            ", (circumference_point, circumference_point, circumference_point)" +
            ", or (center_x, center_y, radius)"
        );

        const make = (spec: SkGgbCircleCtorSpec) =>
          withPropertiesFromNameValuePairs(new mod.Circle(spec), kwargs);

        switch (args.length) {
          case 2: {
            if (ggb.isGgbObjectOfType(args[0], "point")) {
              if (ggb.isPythonOrGgbNumber(args[1])) {
                return make({
                  kind: "center-radius",
                  center: args[0],
                  radius: args[1],
                });
              }

              if (ggb.isGgbObjectOfType(args[1], "point")) {
                return make({
                  kind: "center-point",
                  center: args[0],
                  point: args[1],
                });
              }

              // TODO: isinstance(args[1], mod.Segment)
            }

            throw badArgsError;
          }
          case 3: {
            if (ggb.everyElementIsGgbObjectOfType(args, "point")) {
              return make({
                kind: "three-points",
                points: args,
              });
            }

            if (args.every(ggb.isPythonOrGgbNumber)) {
              return make({
                kind: "center-radius",
                center: new mod.Point({
                  kind: "coordinates",
                  x: ggb.numberValueOrLabel(args[0]),
                  y: ggb.numberValueOrLabel(args[1]),
                }),
                radius: args[2],
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
      ...ggb.withPropertiesMethodsSlice,
      ...ggb.freeCopyMethodsSlice,
    },
    getsets: {
      color: ggb.sharedGetSets.color,
      color_floats: ggb.sharedGetSets.color_floats,
      opacity: ggb.sharedGetSets.opacity,
      line_thickness: ggb.sharedGetSets.line_thickness,
      radius: {
        $get(this: SkGgbCircle) {
          return new Sk.builtin.float_(this.$radiusNumber().$value());
        },
      },
      radius_number: {
        $get(this: SkGgbCircle) {
          return this.$radiusNumber();
        },
      },
      _ggb_type: ggb.sharedGetSets._ggb_type,
    },
  });

  mod.Circle = cls;
  registerObjectType("circle", cls);
};
