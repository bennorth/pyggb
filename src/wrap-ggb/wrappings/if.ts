import { AppApi } from "../../shared/appApi";
import { augmentedGgbApi } from "../shared";
import { SkulptApi } from "../skulptapi";

declare var Sk: SkulptApi;

export const register = (mod: any, appApi: AppApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const fun = new Sk.builtin.func((...args) => {
    // TODO: Allow literals as well?
    if (!ggb.everyElementIsGgbObject(args)) {
      console.error(args);
      throw new Sk.builtin.TypeError("all args must be GGB objects");
    }

    const ggbArgs = args.map((obj) => obj.$ggbLabel).join(",");
    const ggbCmd = `If(${ggbArgs})`;
    const label = ggb.evalCmd(ggbCmd);
    return ggb.wrapExistingGgbObject(label);
  });

  mod.If = fun;
};
