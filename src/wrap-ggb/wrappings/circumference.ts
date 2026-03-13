import { RegisterFun } from "../../shared/appApi";
import { AugmentedGgbApi, augmentedGgbApi } from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi; // eslint-disable-line no-var

const kArgTypes = ["circle", "ellipse"];

export const register: RegisterFun = (mod, appApi) => {
  const ggb: AugmentedGgbApi = augmentedGgbApi(appApi.ggb);

  const fun = new Sk.builtin.func((...args) => {
    const badArgsError = new Sk.builtin.TypeError(
      "Circumference() arguments must be (circle) or (ellipse)"
    );

    switch (args.length) {
      case 1: {
        const arg = args[0];
        if (!ggb.isGgbObjectOfSomeType(arg, kArgTypes)) {
          throw badArgsError;
        }
        return ggb.existingFromCmdAndGgbArgs("Circumference", [arg]);
      }
      default:
        throw badArgsError;
    }
  });

  mod.Circumference = fun;
};
