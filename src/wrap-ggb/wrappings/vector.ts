import { RegisterFun } from "../../shared/appApi";
import {
  augmentedGgbApi,
  withPropertiesFromNameValuePairs,
  SkGgbObject,
  labelGetSets,
} from "../shared";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";

import { registerObjectType } from "../type-registry";
import {
  constructIfMatching,
  ggbArgumentStr,
  SignatureSpec,
} from "../command-invocation";
import { GgbApi } from "../../shared/vendor-types/ggbapi";

declare var Sk: SkulptApi; // eslint-disable-line no-var

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SkGgbVector extends SkGgbObject {}

const makeComponentCommand = (ggb: GgbApi, args: Array<SkObject>) => {
  const argStrs = args.map((arg) => ggbArgumentStr(ggb, arg));
  return `Vector((${argStrs[0]},${argStrs[1]}))`;
};

const kCtorSignatures: Array<SignatureSpec> = [
  { argTypes: ["point", "point"] },
  {
    argTypes: ["either-number", "either-number"],
    ggbCommand: makeComponentCommand,
  },
];

export const register: RegisterFun = (mod, appApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("Vector", {
    constructor: function Vector(this: SkGgbVector, ggbLabel: string) {
      this.$ggbLabel = ggbLabel;
    },
    slots: {
      tp$new(args, kwargs) {
        return withPropertiesFromNameValuePairs(
          constructIfMatching(appApi.ggb, kCtorSignatures, "Vector", args, cls),
          kwargs
        );
      },
      ...ggb.sharedOpSlots,
    },
    proto: {
      ...ggb.sharedCoordinateProtoSlots,
    },
    methods: {
      ...ggb.withPropertiesMethodsSlice,
      ...ggb.freeCopyMethodsSlice,
    },
    getsets: {
      x: ggb.sharedGetSets.x,
      y: ggb.sharedGetSets.y,
      latex: ggb.sharedGetSets.latex,
      is_independent: ggb.sharedGetSets.is_independent,
      is_visible: ggb.sharedGetSets.is_visible,
      color: ggb.sharedGetSets.color,
      color_floats: ggb.sharedGetSets.color_floats,
      line_thickness: ggb.sharedGetSets.line_thickness,
      line_style: ggb.sharedGetSets.line_style,
      ...labelGetSets(ggb.sharedGetSets),
      _ggb_label: ggb.sharedGetSets._ggb_label,
      _ggb_type: ggb.sharedGetSets._ggb_type,
    },
  });

  mod.Vector = cls;
  registerObjectType("vector", cls);
};
