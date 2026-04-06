import { RegisterFun } from "../../shared/appApi";
import {
  augmentedGgbApi,
  SkGgbObject,
  strOfNumber,
  throwIfNotNumber,
} from "../shared";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";
import { GgbApi } from "../../shared/vendor-types/ggbapi";

import { registerObjectType } from "../type-registry";
import { constructIfMatching, SignatureSpec } from "../command-invocation";

declare var Sk: SkulptApi; // eslint-disable-line no-var

export interface SkGgbNumber extends SkGgbObject {
  $value(): number;
}

const makeLiteralCommand = (ggb: GgbApi, args: Array<SkObject>) => {
  const arg = args[0];
  throwIfNotNumber(arg, "number argument (internal error)");
  return strOfNumber(arg.v);
};

const kCtorSignatures: Array<SignatureSpec> = [
  { argTypes: ["py-number"], ggbCommand: makeLiteralCommand },
];

export const register: RegisterFun = (mod, appApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("Number", {
    constructor: function Number(this: SkGgbNumber, ggbLabel: string) {
      this.$ggbLabel = ggbLabel;
    },
    slots: {
      tp$new(args) {
        // In fact the ggbCommand arg ("Number") is ignored, because
        // the only spec has a custom ggbCommand(), but provide it
        // anyway.
        return constructIfMatching(
          appApi.ggb,
          kCtorSignatures,
          "Number",
          args,
          cls
        );
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
      latex: ggb.sharedGetSets.latex,
      is_independent: ggb.sharedGetSets.is_independent,
      value: ggb.sharedGetSets.value,
      _ggb_type: ggb.sharedGetSets._ggb_type,
    },
  });

  mod.Number = cls;
  registerObjectType("numeric", cls);
};
