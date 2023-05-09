import { AppApi } from "../../shared/appApi";
import { ggbCompare } from "../operations";
import { AugmentedGgbApi, augmentedGgbApi, SkGgbObject } from "../shared";
import {
  KeywordArgsArray,
  SkObject,
  SkulptApi,
} from "../../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi;

const functionWrapper = (ggb: AugmentedGgbApi, ggbName: string) => {
  return {
    $meth(x: SkGgbObject) {
      // TODO: If given a Python number, evaluate in Python; if a ggb
      // Number, evaluate as dependent Number.
      const ggbCmd = `${ggbName}(${x.$ggbLabel})`;
      const label = ggb.evalCmd(ggbCmd);
      return ggb.wrapExistingGgbObject(label);
    },
    $flags: { OneArg: true },
  };
};

export const register = (mod: any, appApi: AppApi) => {
  const ggbApi = appApi.ggb;
  const ggb = augmentedGgbApi(ggbApi);

  try {
    const cls = Sk.abstr.buildNativeClass("Function", {
      constructor: function Function() {},
      classmethods: {
        sin: functionWrapper(ggb, "sin"),
        cos: functionWrapper(ggb, "cos"),
        compare_LT: {
          $flags: { FastCall: true },
          $meth(args: Array<SkObject>, _kwargs: KeywordArgsArray) {
            // TODO: Check no kwargs.
            return ggbCompare(ggbApi, args[0], args[1], "<");
          },
        },
      },
    });
    mod.Function = cls;
  } catch (e) {
    console.error("FUNCTION", e);
    throw e;
  }
};
