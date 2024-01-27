import { AppApi } from "../../shared/appApi";
import { augmentedGgbApi, assembledCommand, AugmentedGgbApi } from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi;

export const register = (mod: any, appApi: AppApi) => {
  const ggb: AugmentedGgbApi = augmentedGgbApi(appApi.ggb);

  const fun = new Sk.builtin.func((...args) => {
    const badArgsError = new Sk.builtin.TypeError(
      "Rotate() arguments must be" +
        " (object, angle)" +
        " or (object, angle, rotation_center_point)"
    );

    switch (args.length) {
      case 2: {
        if (args.length !== 2 || !ggb.isGgbObject(args[0]))
          throw new Sk.builtin.TypeError("need 2 args to Rotate()");

        const angleArg = (() => {
          const pyAngle = args[1];
          if (ggb.isPythonOrGgbNumber(pyAngle)) {
            return ggb.numberValueOrLabel(pyAngle);
          }
          throw new Sk.builtin.TypeError(
            "angle arg must be ggb Numeric or number"
          );
        })();

        const ggbCmd = assembledCommand("Rotate", [
          args[0].$ggbLabel,
          angleArg,
        ]);
        const label = ggb.evalCmd(ggbCmd);
        return ggb.wrapExistingGgbObject(label);
      }
      default:
        throw badArgsError;
    }
  });

  mod.Rotate = fun;
};
