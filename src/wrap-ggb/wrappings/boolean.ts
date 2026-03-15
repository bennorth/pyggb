import { AppApi } from "../../shared/appApi";
import { augmentedGgbApi, WrapExistingCtorSpec, SkGgbObject } from "../shared";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";

import { registerObjectType } from "../type-registry";

declare var Sk: SkulptApi; // eslint-disable-line no-var

interface SkGgbBoolean extends SkGgbObject {}

type SkGgbBooleanCtorSpec =
  | WrapExistingCtorSpec
  | {
      kind: "literal";
      value: SkObject;
    };

export const register = (mod: any, appApi: AppApi) => {
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
          throw new Sk.builtin.TypeError(
            `bad Boolean spec kind "${(spec as any).kind}"`
          );
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
