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
      const setLabelArgs = setGgbLabelFromArgs(ggb, this, "Ellipse");

      switch (spec.kind) {
        case "wrap-existing": {
          this.$ggbLabel = spec.label;
          break;
        }
        case "foci-semimajor-axis-length": {
          const focus1 = spec.focus1.$ggbLabel;
          const focus2 = spec.focus2.$ggbLabel;
          const smAxis = ggb.numberValueOrLabel(spec.semimajorAxis);
          setLabelArgs([focus1, focus2, smAxis]);
          break;
        }
        case "foci-semimajor-axis-segment": {
          const focus1 = spec.focus1.$ggbLabel;
          const focus2 = spec.focus2.$ggbLabel;
          const smAxis = spec.semimajorAxis.$ggbLabel;
          setLabelArgs([focus1, focus2, smAxis]);
          break;
        }
        case "foci-point": {
          const focus1 = spec.focus1.$ggbLabel;
          const focus2 = spec.focus2.$ggbLabel;
          const point = spec.point.$ggbLabel;
          setLabelArgs([focus1, focus2, point]);
          break;
        }
        default:
          throw new Sk.builtin.RuntimeError(
            `bad Ellipse spec kind "${(spec as any).kind}"`
          );
      }
    },
    slots: {
      tp$new(args, kwargs) {
        const badArgsError = new Sk.builtin.TypeError(
          "Ellipse() arguments must be" +
            " (focus, focus, semimajor_axis_length)," +
            " (focus, focus, semimajor_axis_segment)," +
            " or (focus, focus, point)"
        );

        const make = (spec: SkGgbEllipseCtorSpec) =>
          withPropertiesFromNameValuePairs(new mod.Ellipse(spec), kwargs);

        switch (args.length) {
          case 3:
            if (
              ggb.isGgbObjectOfType(args[0], "point") &&
              ggb.isGgbObjectOfType(args[1], "point")
            ) {
              if (ggb.isPythonOrGgbNumber(args[2])) {
                return make({
                  kind: "foci-semimajor-axis-length",
                  focus1: args[0],
                  focus2: args[1],
                  semimajorAxis: args[2],
                });
              }
              if (ggb.isGgbObjectOfType(args[2], "segment")) {
                return make({
                  kind: "foci-semimajor-axis-segment",
                  focus1: args[0],
                  focus2: args[1],
                  semimajorAxis: args[2],
                });
              }
              if (ggb.isGgbObjectOfType(args[2], "point")) {
                return make({
                  kind: "foci-point",
                  focus1: args[0],
                  focus2: args[1],
                  point: args[2],
                });
              }
            }
            throw badArgsError;
          default:
            throw badArgsError;
        }
      },
    },
    methods: {
      ...ggb.freeCopyMethodsSlice,
    },
    getsets: {
      is_visible: ggb.sharedGetSets.is_visible,
      color: ggb.sharedGetSets.color,
      color_floats: ggb.sharedGetSets.color_floats,
      opacity: ggb.sharedGetSets.opacity,
      line_thickness: ggb.sharedGetSets.line_thickness,
      _ggb_type: ggb.sharedGetSets._ggb_type,
    },
  });

  mod.Ellipse = cls;
  registerObjectType("ellipse", cls);
};
