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

    const ggbRotate = (extraArgs: Array<string>) => {
      if (!ggb.isGgbObject(args[0])) {
        throw badArgsError;
      }

      const pyAngle = args[1];
      ggb.throwIfNotPyOrGgbNumber(pyAngle, "rotation angle");
      const angleArg = ggb.numberValueOrLabel(pyAngle);

      const ggbArgs = [args[0].$ggbLabel, angleArg, ...extraArgs];
      const ggbCmd = assembledCommand("Rotate", ggbArgs);
      const label = ggb.evalCmd(ggbCmd);
      return ggb.wrapExistingGgbObject(label);
    };

    switch (args.length) {
      case 2: {
        if (!ggb.isGgbObject(args[0])) {
          throw badArgsError;
        }

        const pyAngle = args[1];
        ggb.throwIfNotPyOrGgbNumber(pyAngle, "rotation angle");
        const angleArg = ggb.numberValueOrLabel(pyAngle);

        const ggbArgs = [args[0].$ggbLabel, angleArg];
        const ggbCmd = assembledCommand("Rotate", ggbArgs);
        const label = ggb.evalCmd(ggbCmd);
        return ggb.wrapExistingGgbObject(label);
      }
      case 3: {
        if (
          !ggb.isGgbObject(args[0]) ||
          !ggb.isGgbObjectOfType(args[2], "point")
        ) {
          throw badArgsError;
        }

        const pyAngle = args[1];
        ggb.throwIfNotPyOrGgbNumber(pyAngle, "rotation angle");
        const angleArg = ggb.numberValueOrLabel(pyAngle);

        const ggbArgs = [args[0].$ggbLabel, angleArg, args[2].$ggbLabel];
        const ggbCmd = assembledCommand("Rotate", ggbArgs);
        const label = ggb.evalCmd(ggbCmd);
        return ggb.wrapExistingGgbObject(label);
      }
      default:
        throw badArgsError;
    }
  });

  mod.Rotate = fun;
};
