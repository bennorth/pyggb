import { RegisterFun } from "../../shared/appApi";
import { throwBadSpecKind } from "../../shared/utils";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";
import {
  augmentedGgbApi,
  labelGetSets,
  setGgbLabelFromCmd,
  SkGgbObject,
  tpCallFun,
  WrapExistingCtorSpec,
} from "../shared";
import { registerObjectType } from "../type-registry";

declare var Sk: SkulptApi; // eslint-disable-line no-var

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SkGgbFunctionGraph extends SkGgbObject {}

type SkGgbFunctionGraphCtorSpec =
  | WrapExistingCtorSpec
  | { kind: "expression"; expr: string }
  | { kind: "expression-range"; expr: string; range: Array<SkObject> };

export const register: RegisterFun = (mod, appApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  function numberArgStrings(
    args: Array<SkObject>,
    errorMessage: string
  ): Array<string> {
    if (!args.every(ggb.isPythonOrGgbNumber)) {
      throw new Sk.builtin.TypeError(errorMessage);
    }
    return args.map(ggb.numberValueOrLabel);
  }

  function createFunctionObject(cmd: string) {
    const lbl = ggb.evalCmd(cmd);
    return ggb.wrapExistingGgbObject(lbl);
  }

  const exponential = {
    $meth(a: SkObject, b: SkObject) {
      const [aArg, bArg] = numberArgStrings(
        [a, b],
        "exponential() arguments must be (a, b) for y = a b^x"
      );

      return createFunctionObject(`y=(${aArg})((${bArg})^x)`);
    },
    $flags: { MinArgs: 2, MaxArgs: 2 },
  };

  const power = {
    $meth(a: SkObject, b: SkObject) {
      const [aArg, bArg] = numberArgStrings(
        [a, b],
        "power() arguments must be (a, b) for y = a x^b"
      );

      return createFunctionObject(`y=(${aArg})(x^(${bArg}))`);
    },
    $flags: { MinArgs: 2, MaxArgs: 2 },
  };

  const logarithm = {
    $meth(a: SkObject, b: SkObject, c: SkObject) {
      const [aArg, bArg, cArg] = numberArgStrings(
        [a, b, c],
        "logarithm() arguments must be (a, b, c) for y = a log_b(c x)"
      );

      return createFunctionObject(`y=(${aArg})(log((${bArg}),(${cArg})(x)))`);
    },
    $flags: { MinArgs: 3, MaxArgs: 3 },
  };

  const cls = Sk.abstr.buildNativeClass("FunctionGraph", {
    constructor: function GeoGebraFunction(
      this: SkGgbFunctionGraph,
      spec: SkGgbFunctionGraphCtorSpec
    ) {
      // Handle null return by ourselves, to try to give a more helpful
      // error message.
      const nubSetLabelFromCmd = setGgbLabelFromCmd(ggb, this);
      const setLabelFromCmd = (expr: string, cmd: string) => {
        nubSetLabelFromCmd(cmd, { allowNullLabel: true });
        if (this.$ggbLabel == null) {
          throw new Sk.builtin.ValueError(
            `bad syntax of expression string "${expr}"`
          );
        }
      };
      switch (spec.kind) {
        case "wrap-existing":
          this.$ggbLabel = spec.label;
          return;
        case "expression": {
          setLabelFromCmd(spec.expr, `y=${spec.expr}`);
          return;
        }
        case "expression-range": {
          const lbNumber = ggb.numberValueOrLabel(spec.range[0]);
          const ubNumber = ggb.numberValueOrLabel(spec.range[1]);
          setLabelFromCmd(
            spec.expr,
            `Function(${spec.expr},${lbNumber},${ubNumber})`
          );
          return;
        }
        default:
          throwBadSpecKind("FunctionGraph", spec);
      }
    },
    slots: {
      tp$new(args) {
        const badArgsError = new Sk.builtin.TypeError(
          "FunctionGraph() arguments must be" +
            " (expression_string)" +
            " or (expression_string, lower_bound, upper_bound)"
        );

        const make = (spec: SkGgbFunctionGraphCtorSpec) =>
          new mod.FunctionGraph(spec);

        switch (args.length) {
          case 1: {
            const arg = args[0];
            if (!Sk.builtin.checkString(arg)) {
              throw badArgsError;
            }
            return make({ kind: "expression", expr: arg.v });
          }
          case 3: {
            const exprArg = args[0];
            const rangeArgs = args.slice(1);
            if (
              !Sk.builtin.checkString(exprArg) ||
              !rangeArgs.every(ggb.isPythonOrGgbNumber)
            ) {
              throw badArgsError;
            }
            return make({
              kind: "expression-range",
              expr: exprArg.v,
              range: rangeArgs,
            });
          }
          default:
            throw badArgsError;
        }
      },
      tp$call: tpCallFun(ggb, "FunctionGraph"),
    },
    classmethods: {
      power,
      exponential,
      logarithm,
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

  mod.FunctionGraph = cls;
  registerObjectType("function", cls);
};
