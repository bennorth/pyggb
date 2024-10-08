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
  const skApi = appApi.sk;

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

      this.$updateHandlers = [];
      ggb.registerObjectUpdateListener(this.$ggbLabel, () =>
        this.$fireUpdateEvents()
      );
    },
    slots: {
      tp$new(args, kwargs) {
        const badArgsError = new Sk.builtin.TypeError(
          "Slider() arguments must be" +
            " (min_value_number, max_value_number, **kwargs)"
        );

        switch (args.length) {
          case 2: {
            if (args.every(Sk.builtin.checkNumber)) {
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
            }

            throw badArgsError;
          }
          default:
            throw badArgsError;
        }
      },
    },
    proto: {
      $fireUpdateEvents(this: SkGgbSlider) {
        this.$updateHandlers.forEach((fun) => {
          try {
            Sk.misceval.callsimOrSuspend(fun);
          } catch (e) {
            skApi.onError(e as any);
          }
        });
      },
    },
    methods: {
      when_changed: {
        $meth(this: SkGgbSlider, pyFun: any) {
          this.$updateHandlers.push(pyFun);
          return pyFun;
        },
        $flags: { OneArg: true },
      },
    },
    getsets: {
      is_visible: ggb.sharedGetSets.is_visible,
      value: ggb.sharedGetSets.value,
      label_visible: ggb.sharedGetSets.label_visible,
      label_style: ggb.sharedGetSets.label_style,
      caption: ggb.sharedGetSets.caption,
      _ggb_type: ggb.sharedGetSets._ggb_type,
    },
  });

  mod.Slider = cls;
  // Slider objects show up as "numeric".
};
