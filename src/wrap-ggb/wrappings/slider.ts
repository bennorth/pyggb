import { RegisterFun } from "../../shared/appApi";
import {
  augmentedGgbApi,
  SkGgbObject,
  AugmentedGgbApi,
  strOfNumber,
  strOfBool,
  labelGetSets,
} from "../shared";
import {
  SkObject,
  SkulptApi,
  KeywordArgsArray,
} from "../../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi; // eslint-disable-line no-var

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SkGgbSlider extends SkGgbObject {}

// TODO: Tidy up these keyword-handling functions and move them to
// shared.

type MaybeKeywordArgsArray = KeywordArgsArray | undefined;

const kwOrDefault = (
  rawKwargs: MaybeKeywordArgsArray,
  argName: string,
  isCorrectType: (obj: SkObject) => boolean,
  jsDefault: number | boolean
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
  jsDefault: number
) => {
  return kwOrDefault(kwargs, argName, Sk.builtin.checkNumber, jsDefault);
};

const kwBoolean = (
  kwargs: MaybeKeywordArgsArray,
  argName: string,
  jsDefault: boolean
) => {
  return kwOrDefault(kwargs, argName, Sk.builtin.checkBool, jsDefault);
};

export const register: RegisterFun = (mod, appApi) => {
  const ggb: AugmentedGgbApi = augmentedGgbApi(appApi.ggb);
  const skApi = appApi.sk;

  const cls = Sk.abstr.buildNativeClass("Slider", {
    constructor: function Slider(this: SkGgbSlider, ggbLabel: string) {
      this.$ggbLabel = ggbLabel;
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
              const ggbArgs = [
                strOfNumber(args[0].v),
                strOfNumber(args[1].v),
                strOfNumber(kwNumber(kwargs, "increment", 0.1)),
                strOfNumber(kwNumber(kwargs, "speed", 1.0)),
                strOfNumber(kwNumber(kwargs, "width", 100)),
                strOfBool(kwBoolean(kwargs, "isAngle", false)),
                strOfBool(kwBoolean(kwargs, "isHorizontal", true)),
                strOfBool(kwBoolean(kwargs, "isAnimating", false)),
                strOfBool(kwBoolean(kwargs, "isRandom", false)),
              ].join(",");

              const ggbCmd = `Slider(${ggbArgs})`;
              const lbl = ggb.evalCmd(ggbCmd);

              return new mod.Slider(lbl);
            }

            throw badArgsError;
          }
          default:
            throw badArgsError;
        }
      },
      ...ggb.sharedOpSlots,
    },
    proto: {
      $fireUpdateEvents(this: SkGgbSlider) {
        this.$updateHandlers.forEach((fun) => {
          try {
            Sk.misceval.callsimOrSuspend(fun);
          } catch (e) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            skApi.onError(e as any);
          }
        });
      },
    },
    methods: {
      when_changed: {
        $meth(this: SkGgbSlider, pyFun: SkObject) {
          this.$updateHandlers.push(pyFun);
          return pyFun;
        },
        $flags: { OneArg: true },
      },
    },
    getsets: {
      latex: ggb.sharedGetSets.latex,
      is_independent: ggb.sharedGetSets.is_independent,
      is_visible: ggb.sharedGetSets.is_visible,
      value: ggb.sharedGetSets.value,
      ...labelGetSets(ggb.sharedGetSets),
      _ggb_type: ggb.sharedGetSets._ggb_type,
      _ggb_label: ggb.sharedGetSets._ggb_label,
    },
  });

  mod.Slider = cls;
  // Slider objects show up as "numeric".
};
