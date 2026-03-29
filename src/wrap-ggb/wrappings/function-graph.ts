import { RegisterFun } from "../../shared/appApi";
import { throwBadSpecKind } from "../../shared/utils";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";
import {
  augmentedGgbApi,
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
      const setLabelFromCmd = setGgbLabelFromCmd(ggb, this);
      switch (spec.kind) {
        case "wrap-existing":
          this.$ggbLabel = spec.label;
          return;
        case "expression": {
          setLabelFromCmd(`y=${spec.expr}`);
          return;
        }
        case "expression-range": {
          const lbNumber = ggb.numberValueOrLabel(spec.range[0]);
          const ubNumber = ggb.numberValueOrLabel(spec.range[1]);
          setLabelFromCmd(`Function(${spec.expr},${lbNumber},${ubNumber})`);
          return;
        }
        default:
          throwBadSpecKind("FunctionGraph", spec);
      }
    },
    slots: {
      tp$call: tpCallFun(ggb, "FunctionGraph"),
    },
    classmethods: {
      power,
      exponential,
      logarithm,
    },
  });

  mod.FunctionGraph = cls;
  registerObjectType("function", cls);
};
