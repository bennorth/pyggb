import { RegisterFun } from "../../shared/appApi";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";
import { augmentedGgbApi, SkGgbObject, WrapExistingCtorSpec } from "../shared";
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
  });

  mod.FunctionGraph = cls;
  registerObjectType("function", cls);
};
