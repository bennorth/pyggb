import { AppApi } from "../../shared/appApi";
import {
  augmentedGgbApi,
  WrapExistingCtorSpec,
  SkGgbObject,
  AugmentedGgbApi,
  strOfNumber,
  strOfBool,
} from "../shared";
import {
  SkObject,
  SkulptApi,
  KeywordArgsArray,
} from "../../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi;

interface SkGgbSlider extends SkGgbObject {}

type SkGgbSliderCtorSpec =
  | WrapExistingCtorSpec
  | {
      kind: "new";
      min: number;
      max: number;
      increment: number;
      speed: number;
      width: number;
      isAngle: boolean;
      isHorizontal: boolean;
      isAnimating: boolean;
      isRandom: boolean;
    };

// TODO: Tidy up these keyword-handling functions and move them to
// shared.

type MaybeKeywordArgsArray = KeywordArgsArray | undefined;

const kwOrDefault = (
  rawKwargs: MaybeKeywordArgsArray,
  argName: string,
  isCorrectType: (obj: SkObject) => boolean,
  jsDefault: any
) => {
  const kwargs = rawKwargs ?? [];

  const mIndex = kwargs.findIndex((x, i) => i % 2 === 0 && x === argName);
  if (mIndex === -1) {
    return jsDefault;
  }

  const value = kwargs[mIndex + 1] as SkObject;
  if (!isCorrectType(value)) {
    throw new Sk.builtin.TypeError("bad arg type");
  }

  return Sk.ffi.remapToJs(value);
};

const kwNumber = (
  kwargs: MaybeKeywordArgsArray,
  argName: string,
  jsDefault: any
) => {
  return kwOrDefault(kwargs, argName, Sk.builtin.checkNumber, jsDefault);
};

const kwBoolean = (
  kwargs: MaybeKeywordArgsArray,
  argName: string,
  jsDefault: any
) => {
  return kwOrDefault(kwargs, argName, Sk.builtin.checkBool, jsDefault);
};

export const register = (mod: any, appApi: AppApi) => {
  const ggb: AugmentedGgbApi = augmentedGgbApi(appApi.ggb);
  const cls = Sk.abstr.buildNativeClass("Slider", {
    constructor: function Slider(this: SkGgbSlider, spec: SkGgbSliderCtorSpec) {
      // TODO: This is messy; tidy up:
      if (spec.kind === "wrap-existing") {
        this.$ggbLabel = spec.label;
        return;
      }

      const ggbArgs = [
        strOfNumber(spec.min),
        strOfNumber(spec.max),
        strOfNumber(spec.increment),
        strOfNumber(spec.speed),
        strOfNumber(spec.width),
        strOfBool(spec.isAngle),
        strOfBool(spec.isHorizontal),
        strOfBool(spec.isAnimating),
        strOfBool(spec.isRandom),
      ].join(",");

      const ggbCmd = `Slider(${ggbArgs})`;
      const lbl = ggb.evalCmd(ggbCmd);
      this.$ggbLabel = lbl;
    },
    slots: {
      tp$new(args, kwargs) {
        if (args.length !== 2)
          throw new Sk.builtin.TypeError("bad Slider() args; need 2 args");

        const bothNumbers = args.every(Sk.builtin.checkNumber);
        if (!bothNumbers)
          throw new Sk.builtin.TypeError(
            "bad Slider() args; args must be numbers"
          );

        const spec = {
          min: args[0].v,
          max: args[1].v,
          increment: kwNumber(kwargs, "increment", 0.1),
          speed: kwNumber(kwargs, "speed", 1.0),
          width: kwNumber(kwargs, "width", 100),
          isAngle: kwBoolean(kwargs, "isAngle", false),
          isHorizontal: kwBoolean(kwargs, "isHorizontal", true),
          isAnimating: kwBoolean(kwargs, "isAnimating", false),
          isRandom: kwBoolean(kwargs, "isRandom", false),
        };

        return new mod.Slider(spec);
      },
    },
    getsets: {
      value: ggb.sharedGetSets.value,
      _ggb_type: ggb.sharedGetSets._ggb_type,
    },
  });

  mod.Slider = cls;
  // Slider objects show up as "numeric".
};
