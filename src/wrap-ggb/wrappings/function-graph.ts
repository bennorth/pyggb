import { RegisterFun } from "../../shared/appApi";
import { GgbApi } from "../../shared/vendor-types/ggbapi";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";
import {
  constructIfMatching,
  ggbArgumentStr,
  SignatureSpec,
} from "../command-invocation";
import {
  augmentedGgbApi,
  labelGetSets,
  SkGgbObject,
  throwIfNotString,
  tpCallFun,
} from "../shared";
import { registerObjectType } from "../type-registry";

declare var Sk: SkulptApi; // eslint-disable-line no-var

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SkGgbFunctionGraph extends SkGgbObject {}

function exprArgStr(args: Array<SkObject>): string {
  const expr = args[0];
  throwIfNotString(expr, "FunctionGraph() expression");
  return expr.v;
}

const makeExprCommand = (_ggb: GgbApi, args: Array<SkObject>) => {
  const expr = exprArgStr(args);
  return `y=${expr}`;
};

const makeExprRangeCommand = (ggb: GgbApi, args: Array<SkObject>) => {
  const expr = exprArgStr(args);
  const lbNumber = ggbArgumentStr(ggb, args[1]);
  const ubNumber = ggbArgumentStr(ggb, args[2]);
  return `Function(${expr},${lbNumber},${ubNumber})`;
};

const errorMessage = (_ggb: GgbApi, args: Array<SkObject>) => {
  const expr = exprArgStr(args);
  return `bad syntax of expression string "${expr}"`;
};

const kCtorSignatures: Array<SignatureSpec> = [
  { argTypes: ["py-string"], ggbCommand: makeExprCommand, errorMessage },
  {
    argTypes: ["py-string", "either-number", "either-number"],
    ggbCommand: makeExprRangeCommand,
    errorMessage,
  },
];

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
      ggbLabel: string
    ) {
      this.$ggbLabel = ggbLabel;
    },
    slots: {
      tp$new(args) {
        // In fact the ggbCommand arg ("Function") is unused, because
        // the specs have custom ggbCommand()s, but provide it anyway.
        return constructIfMatching(
          appApi.ggb,
          kCtorSignatures,
          "Function",
          args,
          cls
        );
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
