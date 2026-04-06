import { RegisterFun } from "../../shared/appApi";
import {
  augmentedGgbApi,
  SkGgbObject,
  labelGetSets,
  withPropertiesFromNameValuePairs,
} from "../shared";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";
import { registerObjectType } from "../type-registry";
import { SkGgbNumber } from "./number";
import {
  constructIfMatching,
  ggbArgumentStr,
  SignatureSpec,
} from "../command-invocation";
import { GgbApi } from "../../shared/vendor-types/ggbapi";

declare var Sk: SkulptApi; // eslint-disable-line no-var

interface SkGgbCircle extends SkGgbObject {
  radiusNumber: SkGgbNumber | null;
  $_center: SkGgbObject | null;
  $radiusNumber: (this: SkGgbCircle) => SkGgbNumber;
}

const makeThreeNumberCommand = (ggb: GgbApi, args: Array<SkObject>) => {
  const argStrs = args.map((arg) => ggbArgumentStr(ggb, arg));
  return `Circle((${argStrs[0]},${argStrs[1]}),${argStrs[2]})`;
};

const kCtorSignatures: Array<SignatureSpec> = [
  { argTypes: ["point", "either-number"] },
  { argTypes: ["point", "point"] },
  { argTypes: ["point", "segment"] },
  { argTypes: ["point", "point", "point"] },
  {
    argTypes: ["either-number", "either-number", "either-number"],
    ggbCommand: makeThreeNumberCommand,
  },
];

export const register: RegisterFun = (mod, appApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("Circle", {
    constructor: function Circle(this: SkGgbCircle, ggbLabel: string) {
      this.$ggbLabel = ggbLabel;
      this.radiusNumber = null;
      this.$_center = null;
    },
    proto: {
      $radiusNumber(this: SkGgbCircle) {
        if (this.radiusNumber == null) {
          const ggbCmd = `Radius(${this.$ggbLabel})`;
          const label = ggb.evalCmd(ggbCmd);
          this.radiusNumber = new mod.Number(label);
        }
        return this.radiusNumber;
      },
    },
    slots: {
      tp$new(args, kwargs) {
        return withPropertiesFromNameValuePairs(
          constructIfMatching(appApi.ggb, kCtorSignatures, "Circle", args, cls),
          kwargs
        );
      },
    },
    methods: {
      ...ggb.withPropertiesMethodsSlice,
      ...ggb.freeCopyMethodsSlice,
    },
    getsets: {
      latex: ggb.sharedGetSets.latex,
      is_independent: ggb.sharedGetSets.is_independent,
      is_visible: ggb.sharedGetSets.is_visible,
      color: ggb.sharedGetSets.color,
      color_floats: ggb.sharedGetSets.color_floats,
      opacity: ggb.sharedGetSets.opacity,
      line_thickness: ggb.sharedGetSets.line_thickness,
      line_style: ggb.sharedGetSets.line_style,
      center: ggb.sharedGetSets.center,
      radius: {
        $get(this: SkGgbCircle) {
          return new Sk.builtin.float_(this.$radiusNumber().$value());
        },
      },
      radius_number: {
        $get(this: SkGgbCircle) {
          return this.$radiusNumber();
        },
      },
      ...labelGetSets(ggb.sharedGetSets),
      _ggb_label: ggb.sharedGetSets._ggb_label,
      _ggb_type: ggb.sharedGetSets._ggb_type,
    },
  });

  mod.Circle = cls;
  registerObjectType("circle", cls);
};
