import { RegisterFun } from "../../shared/appApi";
import {
  augmentedGgbApi,
  labelGetSets,
  setGgbLabelFromArgs,
  SkGgbObject,
  withPropertiesFromNameValuePairs,
  WrapExistingCtorSpec,
} from "../shared";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";
import { registerObjectType } from "../type-registry";
import { throwBadSpecKind } from "../../shared/utils";

declare var Sk: SkulptApi; // eslint-disable-line no-var

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SkGgbArc extends SkGgbObject {}

type SkGgbArcCtorSpec =
  | WrapExistingCtorSpec
  | {
      kind: "ellipse-points";
      ellipse: SkGgbObject;
      point1: SkGgbObject;
      point2: SkGgbObject;
    }
  | {
      kind: "ellipse-numbers";
      ellipse: SkGgbObject;
      number1: SkObject;
      number2: SkObject;
    };

export const register: RegisterFun = (mod, appApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("Arc", {
    constructor: function Arc(this: SkGgbArc, spec: SkGgbArcCtorSpec) {
      const setLabelArgs = setGgbLabelFromArgs(ggb, this, "Arc");

      switch (spec.kind) {
        case "wrap-existing": {
          this.$ggbLabel = spec.label;
          break;
        }
        case "ellipse-points": {
          setLabelArgs([
            spec.ellipse.$ggbLabel,
            spec.point1.$ggbLabel,
            spec.point2.$ggbLabel,
          ]);
          break;
        }
        case "ellipse-numbers": {
          setLabelArgs([
            spec.ellipse.$ggbLabel,
            ggb.numberValueOrLabel(spec.number1),
            ggb.numberValueOrLabel(spec.number2),
          ]);
          break;
        }
        default:
          throwBadSpecKind("Arc", spec);
      }
    },
    slots: {
      tp$new(args, kwargs) {
        const badArgsError = new Sk.builtin.TypeError(
          "Arc() arguments must be" +
            " (ellipse, point, point) or (ellipse, number, number)," +
            ' where "ellipse" includes "circle"'
        );

        const make = (spec: SkGgbArcCtorSpec) =>
          withPropertiesFromNameValuePairs(new mod.Arc(spec), kwargs);

        switch (args.length) {
          case 3: {
            if (!ggb.isGgbObjectOfSomeType(args[0], ["ellipse", "circle"])) {
              throw badArgsError;
            }

            const limitArgs = args.slice(1);

            if (ggb.everyElementIsGgbObjectOfType(limitArgs, "point")) {
              return make({
                kind: "ellipse-points",
                ellipse: args[0],
                point1: limitArgs[0],
                point2: limitArgs[1],
              });
            }

            if (limitArgs.every(ggb.isPythonOrGgbNumber)) {
              return make({
                kind: "ellipse-numbers",
                ellipse: args[0],
                number1: limitArgs[0],
                number2: limitArgs[1],
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
      is_independent: ggb.sharedGetSets.is_independent,
      is_visible: ggb.sharedGetSets.is_visible,
      color: ggb.sharedGetSets.color,
      color_floats: ggb.sharedGetSets.color_floats,
      opacity: ggb.sharedGetSets.opacity,
      line_thickness: ggb.sharedGetSets.line_thickness,
      line_style: ggb.sharedGetSets.line_style,
      ...labelGetSets(ggb.sharedGetSets),
      _ggb_label: ggb.sharedGetSets._ggb_label,
      _ggb_type: ggb.sharedGetSets._ggb_type,
    },
  });

  mod.Arc = cls;
  registerObjectType("arc", cls);
};
