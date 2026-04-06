import { RegisterFun } from "../../shared/appApi";
import { augmentedGgbApi, SkGgbObject } from "../shared";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";

import { registerObjectType } from "../type-registry";
import { constructIfMatching, SignatureSpec } from "../command-invocation";
import { GgbApi } from "../../shared/vendor-types/ggbapi";

declare var Sk: SkulptApi; // eslint-disable-line no-var

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SkGgbBoolean extends SkGgbObject {}

const ggbCommand = (ggb: GgbApi, args: Array<SkObject>) => {
  const arg = args[0];
  const value = Sk.misceval.isTrue(arg);
  return value ? "true" : "false";
};

const kCtorSignatures: Array<SignatureSpec> = [
  { argTypes: ["py-object"], ggbCommand },
];

export const register: RegisterFun = (mod, appApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("Boolean", {
    constructor: function Boolean(this: SkGgbBoolean, ggbLabel: string) {
      this.$ggbLabel = ggbLabel;
    },
    slots: {
      tp$new(args, _kwargs) {
        // In fact the ggbCommand arg ("Boolean") is ignored, because
        // the only spec has a custom ggbCommand(), but provide it
        // anyway.
        return constructIfMatching(
          appApi.ggb,
          kCtorSignatures,
          "Boolean",
          args,
          cls
        );
      },
    },
    methods: {
      ...ggb.freeCopyMethodsSlice,
    },
    getsets: {
      latex: ggb.sharedGetSets.latex,
      is_independent: ggb.sharedGetSets.is_independent,
      value: {
        $get(this: SkGgbBoolean) {
          return new Sk.builtin.bool(ggb.getValue(this.$ggbLabel));
        },
        $set(this: SkGgbBoolean, pyValue: SkObject) {
          const value = Sk.misceval.isTrue(pyValue);
          ggb.setValue(this.$ggbLabel, value ? 1.0 : 0.0);
        },
      },
      _ggb_type: ggb.sharedGetSets._ggb_type,
    },
  });

  mod.Boolean = cls;
  registerObjectType("boolean", cls);
};
