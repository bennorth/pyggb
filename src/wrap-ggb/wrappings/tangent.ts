import { RegisterFun } from "../../shared/appApi";
import { augmentedGgbApi, AugmentedGgbApi, labelIsValid } from "../shared";
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

export const register: RegisterFun = (mod, appApi) => {
  const ggb: AugmentedGgbApi = augmentedGgbApi(appApi.ggb);

  const fun = new Sk.builtin.func((...args) => {
    const badArgsError = new Sk.builtin.TypeError(
      "Tangent() arguments must be" +
        " (point, conic), (line, conic), or (ellipse, ellipse)," +
        ' where "ellipse" includes "circle"'
    );

    if (!ggb.elementsAreGgbObjectsOfSomeTypes(args, kGgbTypeSignatures)) {
      throw badArgsError;
    }

    const labelsStr = ggb.evalCmdWithGgbArgs("Tangent", args);
    const validLabels = labelsStr.split(",").filter(labelIsValid);

    return new Sk.builtin.list(validLabels.map(ggb.wrapExistingGgbObject));
  });

  mod.Tangent = fun;
};
