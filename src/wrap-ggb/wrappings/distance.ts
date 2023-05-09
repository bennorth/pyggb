import { AppApi } from "../../shared/appApi";
import { AugmentedGgbApi, augmentedGgbApi } from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi;

export const register = (mod: any, appApi: AppApi) => {
  const ggb: AugmentedGgbApi = augmentedGgbApi(appApi.ggb);

  const fun = new Sk.builtin.func((...args) => {
    if (args.length !== 2)
      throw new Sk.builtin.TypeError("bad Distance() args; need 2 args");
    ggb.throwIfNotGgbObjectOfType(args[0], "point", "Distance() ctor arg[0]");
    ggb.throwIfNotGgbObject(args[1], "Distance() ctor arg[1]");

    const ggbArgs = `${args[0].$ggbLabel},${args[1].$ggbLabel}`;
    const ggbCmd = `Distance(${ggbArgs})`;
    const lbl = ggb.evalCmd(ggbCmd);
    const distanceValue = ggb.getValue(lbl);
    ggb.deleteObject(lbl);
    return new Sk.builtin.float_(distanceValue);
  });

  mod.Distance = fun;
};
