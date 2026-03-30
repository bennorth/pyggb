import { RegisterFun } from "../../shared/appApi";
import { augmentedGgbApi, AugmentedGgbApi } from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi; // eslint-disable-line no-var

const kLineArgTypes = ["line", "segment", "vector"];

export const register: RegisterFun = (mod, appApi) => {
  const ggb: AugmentedGgbApi = augmentedGgbApi(appApi.ggb);

  const fun = new Sk.builtin.func((...args) => {
    const badArgsError = new Sk.builtin.TypeError(
      "PerpendicularLine() arguments must be" +
        " (point, line), or (point, segment), or (point, vector)"
    );

    switch (args.length) {
      case 2: {
        const pointArg = args[0];
        if (!ggb.isGgbObjectOfType(pointArg, "point")) {
          throw badArgsError;
        }
        const lineArg = args[1];
        if (!ggb.isGgbObjectOfSomeType(lineArg, kLineArgTypes)) {
          throw badArgsError;
        }
        return ggb.existingFromCmdAndGgbArgs("PerpendicularLine", [
          pointArg,
          lineArg,
        ]);
      }
      default:
        throw badArgsError;
    }
  });

  mod.PerpendicularLine = fun;
};
