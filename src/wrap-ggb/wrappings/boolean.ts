import { RegisterFun } from "../../shared/appApi";
import { augmentedGgbApi, WrapExistingCtorSpec, SkGgbObject } from "../shared";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";

import { registerObjectType } from "../type-registry";
import { throwBadSpecKind } from "../../shared/utils";

declare var Sk: SkulptApi; // eslint-disable-line no-var

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SkGgbBoolean extends SkGgbObject {}

type SkGgbBooleanCtorSpec =
  | WrapExistingCtorSpec
  | {
      kind: "literal";
      value: SkObject;
    };

export const register: RegisterFun = (mod, appApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("Boolean", {
    constructor: function Boolean(
      this: SkGgbBoolean,
      spec: SkGgbBooleanCtorSpec
    ) {
      switch (spec.kind) {
        case "wrap-existing": {
          this.$ggbLabel = spec.label;
          break;
        }
        case "literal": {
          const ggbCmd = spec.value ? "true" : "false";
          const label = ggb.evalCmd(ggbCmd);
          this.$ggbLabel = label;
          break;
        }
        default:
          throwBadSpecKind("Boolean", spec);
      }
    },
    slots: {
      tp$new(args, _kwargs) {
        const badArgsError = new Sk.builtin.TypeError(
          "Boolean() arguments must be (python_object)"
        );

        switch (args.length) {
          case 1: {
            const value = Sk.misceval.isTrue(args[0]);
            return new mod.Boolean({ kind: "literal", value });
          }
          default:
            throw badArgsError;
        }
      },
    },
    methods: {
      ...ggb.freeCopyMethodsSlice,
    },
    getsets: {
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
