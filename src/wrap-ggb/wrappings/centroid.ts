import { RegisterFun } from "../../shared/appApi";
import { augmentedGgbApi, AugmentedGgbApi } from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi; // eslint-disable-line no-var

export const register: RegisterFun = (mod, appApi) => {
  const ggb: AugmentedGgbApi = augmentedGgbApi(appApi.ggb);

  const fun = new Sk.builtin.func((...args) => {
    const badArgsError = new Sk.builtin.TypeError(
      "Centroid() arguments must be (polygon)"
    );

    switch (args.length) {
      case 1: {
        const arg = args[0];
        if (!ggb.isGgbObjectOfType(arg, "polygon")) {
          throw badArgsError;
        }

        const ggbCmd = `Centroid(${arg.$ggbLabel})`;
        const label = ggb.evalCmd(ggbCmd);
        return ggb.wrapExistingGgbObject(label);
      }
      default:
        throw badArgsError;
    }
  });

  mod.Centroid = fun;
};
