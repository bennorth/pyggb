import { RegisterFun } from "../../shared/appApi";
import { AugmentedGgbApi, augmentedGgbApi } from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi; // eslint-disable-line no-var

const badArgsError = new Sk.builtin.TypeError(
  "Distance() arguments must be (object, object)"
);

export const register: RegisterFun = (mod, appApi) => {
  const ggb: AugmentedGgbApi = augmentedGgbApi(appApi.ggb);

  mod.Distance = new Sk.builtin.func(function Distance(...args) {
    if (args.length !== 2 || !ggb.everyElementIsGgbObject(args)) {
      throw badArgsError;
    }

    const mNumber = ggb.evalCmdWithGgbArgs("Distance", args);
    if (mNumber == null) {
      const ggbTypes = args.map(ggb.ggbType);
      throw new Sk.builtin.RuntimeError(
        "Distance(): unable to compute distance between" +
          ` the given ${ggbTypes[0]} and ${ggbTypes[1]}`
      );
    }

    return ggb.wrapExistingGgbObject(mNumber);
  });
};
