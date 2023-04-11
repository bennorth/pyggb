import { AppApi } from "../../shared/appApi";
import {
  augmentedGgbApi,
  SkGgbObject,
  strOfNumber,
  throwIfNotNumber,
  WrapExistingCtorSpec,
} from "../shared";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";

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
        case "literal":
          const ggbCmd = strOfNumber(spec.value);
          const label = ggb.evalCmd(ggbCmd);
          this.$ggbLabel = label;
          break;
        case "wrap-existing":
          this.$ggbLabel = spec.label;
          break;
        default:
          throw new Sk.builtin.TypeError(
            `bad spec.kind "${(spec as any).kind}" for Number`
          );
      }
    },
    slots: {
      tp$new(args, _kwargs) {
        throwIfNotNumber(args[0], "constructor arg");
        return new mod.Number({ kind: "literal", value: args[0].v });
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
    },
  });

  mod.Number = cls;
  registerObjectType("numeric", cls);
};
