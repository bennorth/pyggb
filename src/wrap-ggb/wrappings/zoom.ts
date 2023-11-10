import { AppApi } from "../../shared/appApi";
import {
  SkulptApi,
  augmentedSkulptApi,
} from "../../shared/vendor-types/skulptapi";
import { assembledCommand, augmentedGgbApi } from "../shared";

declare var Sk: SkulptApi;

export const register = (mod: any, appApi: AppApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const zoomIn = new Sk.builtin.func((...args) => {
    const badArgsError = new Sk.builtin.TypeError(
      "ZoomIn() arguments must be: empty (to reset to default);" +
        " a single number (scale factor);" +
        " a number (scale factor) and a point (zoom centre);" +
        " a number (scale factor) and a 2-element tuple or list (zoom centre);" +
        " or four numbers (min-x, min-y, max-x, max-y)"
    );
    function throwBadArgsUnless(argsAreOk: boolean): asserts argsAreOk is true {
      if (!argsAreOk) {
        throw badArgsError;
      }
    }

    switch (args.length) {
      case 0:
        ggb.evalCmd("ZoomIn()");
        break;
      case 1: {
        // ZoomIn(scale)

        const scale = args[0];
        throwBadArgsUnless(ggb.isPythonOrGgbNumber(scale));

        const scaleArg = ggb.numberValueOrLabel(scale);
        const ggbCmd = assembledCommand("ZoomIn", [scaleArg]);
        ggb.evalCmd(ggbCmd);
        break;
      }
      default:
        throw badArgsError;
    }

    return Sk.builtin.none.none$;
  });

  mod.ZoomIn = zoomIn;
};
