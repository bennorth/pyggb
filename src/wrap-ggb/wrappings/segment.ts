import { RegisterFun } from "../../shared/appApi";
import {
  augmentedGgbApi,
  withPropertiesFromNameValuePairs,
  SkGgbObject,
  labelGetSets,
} from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";

import { registerObjectType } from "../type-registry";
import { constructIfMatching, SignatureSpec } from "../command-invocation";

declare var Sk: SkulptApi; // eslint-disable-line no-var

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SkGgbSegment extends SkGgbObject {}

const kCtorSignatures: Array<SignatureSpec> = [
  { argTypes: ["point", "point"] },
];

export const register: RegisterFun = (mod, appApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("Segment", {
    constructor: function Segment(this: SkGgbSegment, ggbLabel: string) {
      this.$ggbLabel = ggbLabel;
    },
    slots: {
      tp$new(args, kwargs) {
        return withPropertiesFromNameValuePairs(
          constructIfMatching(
            appApi.ggb,
            kCtorSignatures,
            "Segment",
            args,
            cls
          ),
          kwargs
        );
      },
    },
    methods: {
      ...ggb.freeCopyMethodsSlice,
    },
    getsets: {
      // "length" is reserved word for Skulpt, so the property must be
      // set up with this mangled name:
      length_$rw$: {
        $get(this: SkGgbSegment) {
          return new Sk.builtin.float_(ggb.getValue(this.$ggbLabel));
        },
      },
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

  mod.Segment = cls;
  registerObjectType("segment", cls);
};
