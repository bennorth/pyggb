import { RegisterFun } from "../../shared/appApi";
import { augmentedGgbApi, AugmentedGgbApi } from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi; // eslint-disable-line no-var

const kArgTypes = ["segment", "circle", "ellipse"];

export const register: RegisterFun = (mod, appApi) => {
  const ggb: AugmentedGgbApi = augmentedGgbApi(appApi.ggb);

  const fun = new Sk.builtin.func((...args) => {
    const badArgsError = new Sk.builtin.TypeError(
      "Midpoint() arguments must be" +
        " (segment), or (circle), or (ellipse), or (point, point)"
    );

    switch (args.length) {
      case 1: {
        const arg = args[0];
        if (!ggb.isGgbObjectOfSomeType(arg, kArgTypes)) {
          throw badArgsError;
        }
        return ggb.existingFromCmdAndGgbArgs("Midpoint", [arg]);
      }
      case 2: {
        if (!ggb.everyElementIsGgbObjectOfType(args, "point")) {
          throw badArgsError;
        }
        return ggb.existingFromCmdAndGgbArgs("Midpoint", args);
      }
      default:
        throw badArgsError;
    }
  });

  mod.Midpoint = fun;
};
