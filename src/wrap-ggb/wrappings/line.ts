import { RegisterFun } from "../../shared/appApi";
import {
  augmentedGgbApi,
  labelGetSets,
  setGgbLabelFromArgs,
  setGgbLabelFromCmd,
  SkGgbObject,
  withPropertiesFromNameValuePairs,
  WrapExistingCtorSpec,
} from "../shared";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";

import { registerObjectType } from "../type-registry";
import { throwBadSpecKind } from "../../shared/utils";

declare var Sk: SkulptApi; // eslint-disable-line no-var

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SkGgbLine extends SkGgbObject {}

type SkGgbLineCtorSpec =
  | WrapExistingCtorSpec
  | { kind: "point-point"; points: Array<SkGgbObject> }
  | { kind: "coefficients"; coeffs: [SkObject, SkObject] };

export const register: RegisterFun = (mod, appApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("Line", {
    constructor: function Line(this: SkGgbLine, spec: SkGgbLineCtorSpec) {
      const setLabelCmd = setGgbLabelFromCmd(ggb, this);
      const setLabelArgs = setGgbLabelFromArgs(ggb, this, "Line");

      switch (spec.kind) {
        case "wrap-existing": {
          this.$ggbLabel = spec.label;
          return;
        }
        case "point-point": {
          setLabelArgs(spec.points.map((p) => p.$ggbLabel));
          return;
        }
        case "coefficients": {
          const ggbCoeffs = spec.coeffs.map(ggb.numberValueOrLabel);
          setLabelCmd(`y=(${ggbCoeffs[0]})x + (${ggbCoeffs[1]})`);
          return;
        }
        default:
          throwBadSpecKind("Line", spec);
      }
    },
    slots: {
      tp$new(args, kwargs) {
        const badArgsError = new Sk.builtin.TypeError(
          "Line() arguments must be (point, point) or (slope, intercept)"
        );

        const make = (spec: SkGgbLineCtorSpec) =>
          withPropertiesFromNameValuePairs(new mod.Line(spec), kwargs);

        switch (args.length) {
          case 2: {
            if (ggb.everyElementIsGgbObjectOfType(args, "point")) {
              return make({ kind: "point-point", points: args });
            }

            if (args.every(ggb.isPythonOrGgbNumber)) {
              // We know that args is a two-element array of SkObjects,
              // but TypeScript can't yet work that out.
              return make({
                kind: "coefficients",
                coeffs: args as [SkObject, SkObject],
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
      latex: ggb.sharedGetSets.latex,
      is_independent: ggb.sharedGetSets.is_independent,
      is_visible: ggb.sharedGetSets.is_visible,
      color: ggb.sharedGetSets.color,
      color_floats: ggb.sharedGetSets.color_floats,
      line_thickness: ggb.sharedGetSets.line_thickness,
      line_style: ggb.sharedGetSets.line_style,
      ...labelGetSets(ggb.sharedGetSets),
      _ggb_label: ggb.sharedGetSets._ggb_label,
      _ggb_type: ggb.sharedGetSets._ggb_type,
    },
  });

  mod.Line = cls;
  registerObjectType("line", cls);
};
