import { RegisterFun } from "../../shared/appApi";
import { augmentedGgbApi, AugmentedGgbApi } from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi; // eslint-disable-line no-var

export const register: RegisterFun = (mod, appApi) => {
  const ggb: AugmentedGgbApi = augmentedGgbApi(appApi.ggb);

  const fun = new Sk.builtin.func((...args) => {
    const badArgsError = new Sk.builtin.TypeError(
      "Incircle() arguments must be (point, point, point)"
    );

    switch (args.length) {
      case 3: {
        if (!ggb.everyElementIsGgbObjectOfType(args, "point")) {
          throw badArgsError;
        }

        const ggbArgs = args.map((a) => a.$ggbLabel);
        const ggbArgStr = ggbArgs.join(",");
        const ggbCmd = `Incircle(${ggbArgStr})`;
        const label = ggb.evalCmd(ggbCmd);
        return ggb.wrapExistingGgbObject(label);
      }
      default:
        throw badArgsError;
    }
  });

  mod.Incircle = fun;
};
