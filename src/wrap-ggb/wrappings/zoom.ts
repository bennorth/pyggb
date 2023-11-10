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
      case 2: {
        // ZoomIn(scale, centre)

        const scale = args[0];
        throwBadArgsUnless(ggb.isPythonOrGgbNumber(scale));
        const scaleArg = ggb.numberValueOrLabel(scale);

        const centre = args[1];
        if (ggb.isGgbObjectOfType(centre, "point")) {
          const centreArg = centre.$ggbLabel;
          const ggbCmd = assembledCommand("ZoomIn", [scaleArg, centreArg]);
          ggb.evalCmd(ggbCmd);
        } else {
          const centreIsSeq =
            augmentedSkulptApi.checkList(centre) ||
            augmentedSkulptApi.checkTuple(centre);
          throwBadArgsUnless(
            centreIsSeq &&
              centre.v.length === 2 &&
              centre.v.every(ggb.isPythonOrGgbNumber)
          );

          // TypeScript is not quite clever enough to work out we
          // definitely have a list or tuple by this point.
          const centreArray = (centre as any).v;

          const [xArg, yArg] = centreArray.map(ggb.numberValueOrLabel);
          const centrePointCmd = `(${xArg},${yArg})`;
          const centrePoint = ggb.evalCmd(centrePointCmd);

          const zoomCmd = assembledCommand("ZoomIn", [scaleArg, centrePoint]);
          ggb.evalCmd(zoomCmd);

          ggb.deleteObject(centrePoint);
        }
        break;
      }
      case 4: {
        // ZoomIn(minX, minY, maxX, maxY)
        throwBadArgsUnless(args.every(ggb.isPythonOrGgbNumber));
        const bboxArgs = args.map(ggb.numberValueOrLabel);
        const zoomCmd = assembledCommand("ZoomIn", bboxArgs);
        ggb.evalCmd(zoomCmd);
        break;
      }
      default:
        throw badArgsError;
    }

    return Sk.builtin.none.none$;
  });

  mod.ZoomIn = zoomIn;
};
