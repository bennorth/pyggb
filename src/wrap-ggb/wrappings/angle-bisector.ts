import { RegisterFun } from "../../shared/appApi";
import { augmentedGgbApi, AugmentedGgbApi, SkGgbObject } from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi; // eslint-disable-line no-var

export const register: RegisterFun = (mod, appApi) => {
  const ggb: AugmentedGgbApi = augmentedGgbApi(appApi.ggb);

  const fun = new Sk.builtin.func((...args) => {
    const badArgsError = new Sk.builtin.TypeError(
      "AngleBisector() arguments must be" +
        " (line, line) or (point, point, point)"
    );

    const evalWithArgs = (args: Array<SkGgbObject>) =>
      ggb.evalCmdWithGgbArgs("AngleBisector", args);

    switch (args.length) {
      case 2: {
        if (!ggb.everyElementIsGgbObjectOfType(args, "line")) {
          throw badArgsError;
        }

        const labelsStr = evalWithArgs(args);
        const labels = labelsStr.split(",");

        const nLabels = labels.length;
        if (nLabels !== 2) {
          throw new Sk.builtin.RuntimeError(
            "expecting two Ggb objects from AngleBisector(line, line)" +
              ` but got ${nLabels}`
          );
        }

        return new Sk.builtin.list(labels.map(ggb.wrapExistingGgbObject));
      }
      case 3: {
        if (!ggb.everyElementIsGgbObjectOfType(args, "point")) {
          throw badArgsError;
        }

        const label = evalWithArgs(args);
        return ggb.wrapExistingGgbObject(label);
      }
      default:
        throw badArgsError;
    }
  });

  mod.AngleBisector = fun;
};
