import { RegisterFun } from "../../shared/appApi";
import { ggbCompare } from "../operations";
import { AugmentedGgbApi, augmentedGgbApi } from "../shared";
import {
  KeywordArgsArray,
  SkObject,
  SkulptApi,
} from "../../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi; // eslint-disable-line no-var

const functionWrapper = (ggb: AugmentedGgbApi, ggbName: string) => {
  return {
    $meth(x: SkObject) {
      ggb.throwIfNotGgbObject(x, `${ggbName}_arg`);
      // TODO: If given a Python number, evaluate in Python; if a ggb
      // Number, evaluate as dependent Number.
      const ggbCmd = `${ggbName}(${x.$ggbLabel})`;
      const label = ggb.evalCmd(ggbCmd);
      return ggb.wrapExistingGgbObject(label);
    },
    $flags: { OneArg: true },
  };
};

const functionWrapper2 = (ggb: AugmentedGgbApi, ggbName: string) => {
  return {
    $meth(cls: SkObject, x: SkObject, y: SkObject) {
      ggb.throwIfNotGgbObject(x, `${ggbName}_arg1`);
      ggb.throwIfNotGgbObject(y, `${ggbName}_arg2`);
      const ggbCmd = `${ggbName}(${x.$ggbLabel},${y.$ggbLabel})`;
      const label = ggb.evalCmd(ggbCmd);
      return ggb.wrapExistingGgbObject(label);
    },
  };
};

export const register: RegisterFun = (mod, appApi) => {
  const ggbApi = appApi.ggb;
  const ggb = augmentedGgbApi(ggbApi);

  try {
    const cls = Sk.abstr.buildNativeClass("Function", {
      constructor: function Function() {},
      classmethods: {
        sin: functionWrapper(ggb, "sin"),
        cos: functionWrapper(ggb, "cos"),
        log: functionWrapper2(ggb, "log"),
        ln: functionWrapper(ggb, "ln"),
        log10: functionWrapper(ggb, "lg"),
        log2: functionWrapper(ggb, "ld"),
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
