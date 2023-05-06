import { AppApi } from "../../shared/appApi";
import {
  augmentedGgbApi,
  SkGgbObject,
  strOfNumber,
  WrapExistingCtorSpec,
} from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";

import { registerObjectType } from "../type-registry";

declare var Sk: SkulptApi;

interface SkGgbNumber extends SkGgbObject {
  $value(): number;
}

type SkGgbNumberCtorSpec =
  | WrapExistingCtorSpec
  | { kind: "literal"; value: number };

export const register = (mod: any, appApi: AppApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("Number", {
    constructor: function Number(this: SkGgbNumber, spec: SkGgbNumberCtorSpec) {
      switch (spec.kind) {
        case "wrap-existing": {
          this.$ggbLabel = spec.label;
          break;
        }
        case "literal":
          const ggbCmd = strOfNumber(spec.value);
          const label = ggb.evalCmd(ggbCmd);
          this.$ggbLabel = label;
          break;
        default:
          throw new Sk.builtin.TypeError(
            `bad spec.kind "${(spec as any).kind}" for Number`
          );
      }
    },
    slots: {
      tp$new(args, _kwargs) {
        const badArgsError = new Sk.builtin.TypeError(
          "Number() arguments must be (python_number)"
        );

        switch (args.length) {
          case 1: {
            if (Sk.builtin.checkNumber(args[0])) {
              return new mod.Number({ kind: "literal", value: args[0].v });
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
      $value(this: SkGgbNumber) {
        return ggb.getValue(this.$ggbLabel);
      },
    },
    methods: {
      ...ggb.freeCopyMethodsSlice,
    },
    getsets: {
      value: ggb.sharedGetSets.value,
      _ggb_type: ggb.sharedGetSets._ggb_type,
    },
  });

  mod.Number = cls;
  registerObjectType("numeric", cls);
};
