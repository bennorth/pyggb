import { RegisterFun } from "../../shared/appApi";
import {
  AugmentedGgbApi,
  augmentedGgbApi,
  kPolygonTypeAndSubtypes,
} from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi; // eslint-disable-line no-var

const kArgTypes = ["circle", "ellipse", ...kPolygonTypeAndSubtypes];

export const register: RegisterFun = (mod, appApi) => {
  const ggb: AugmentedGgbApi = augmentedGgbApi(appApi.ggb);

  const fun = new Sk.builtin.func((...args) => {
    const badArgsError = new Sk.builtin.TypeError(
      "Area() arguments must be (circle), or (ellipse), or (polygon)," +
        " or (point1, point2, point3, ...) with at least three points"
    );

    switch (args.length) {
      case 0:
        throw badArgsError;
      case 1: {
        const arg = args[0];
        if (!ggb.isGgbObjectOfSomeType(arg, kArgTypes)) {
          throw badArgsError;
        }
        return ggb.existingFromCmdAndGgbArgs("Area", [arg]);
      }
      case 2:
        throw badArgsError;
      default:
        if (!ggb.everyElementIsGgbObjectOfType(args, "point")) {
          throw badArgsError;
        }
        return ggb.existingFromCmdAndGgbArgs("Area", args);
    }
  });

  mod.Area = fun;
};
