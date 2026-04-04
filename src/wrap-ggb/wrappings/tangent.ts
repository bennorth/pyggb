import { RegisterFun } from "../../shared/appApi";
import {
  assembledCommand,
  augmentedGgbApi,
  AugmentedGgbApi,
  labelIsValid,
} from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi; // eslint-disable-line no-var

const kGgbTypeSignatures = [
  ["point", "ellipse"],
  ["point", "circle"],
  ["point", "parabola"],
  ["point", "hyperbola"],
  ["point", "conic"],
  ["line", "ellipse"],
  ["line", "circle"],
  ["line", "parabola"],
  ["line", "hyperbola"],
  ["ellipse", "ellipse"],
  ["ellipse", "circle"],
  ["circle", "ellipse"],
  ["circle", "circle"],
];

const kInternalTangentError = new Sk.builtin.RuntimeError(
  "internal error: bad type for Tangent()"
);

export const register: RegisterFun = (mod, appApi) => {
  const ggb: AugmentedGgbApi = augmentedGgbApi(appApi.ggb);

  const fun = new Sk.builtin.func((...args) => {
    const badArgsError = new Sk.builtin.TypeError(
      "Tangent() arguments must be" +
        " (point, conic), (line, conic), or (ellipse, ellipse)," +
        ' where "ellipse" includes "circle"'
    );

    // One of the simple signatures, yielding a list of lines?
    if (ggb.elementsAreGgbObjectsOfSomeTypes(args, kGgbTypeSignatures)) {
      const labelsStr = ggb.evalCmdWithGgbArgs("Tangent", args);
      const validLabels = labelsStr.split(",").filter(labelIsValid);
      return new Sk.builtin.list(validLabels.map(ggb.wrapExistingGgbObject));
    }

    // Other valid option is Tangent(number|point, function).  Bear in
    // mind that if you call the FunctionGraph() constructor, you might
    // get a "parabola".
    if (args.length === 2) {
      const numberAndFunction =
        ggb.isPythonOrGgbNumber(args[0]) &&
        ggb.isGgbObjectOfSomeType(args[1], ["function", "parabola"]);

      const pointAndFunction = ggb.elementsAreGgbObjectsOfSomeTypes(args, [
        ["point", "function"],
      ]);

      if (numberAndFunction || pointAndFunction) {
        const argStrs = args.map((arg) =>
          ggb.argumentString(arg, kInternalTangentError)
        );

        const ggbCmd = assembledCommand("Tangent", argStrs);
        return ggb.wrapExistingGgbObject(ggb.evalCmd(ggbCmd));
      }
    }

    throw badArgsError;
  });

  mod.Tangent = fun;
};
