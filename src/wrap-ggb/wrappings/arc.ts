import { RegisterFun } from "../../shared/appApi";
import {
  augmentedGgbApi,
  labelGetSets,
  SkGgbObject,
  withPropertiesFromNameValuePairs,
} from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";
import { registerObjectType } from "../type-registry";
import { constructIfMatching, SignatureSpec } from "../command-invocation";

declare var Sk: SkulptApi; // eslint-disable-line no-var

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SkGgbArc extends SkGgbObject {}

const kCtorSignatures: Array<SignatureSpec> = [
  { argTypes: [["circle", "ellipse"], "point", "point"] },
  { argTypes: [["circle", "ellipse"], "either-number", "either-number"] },
];

export const register: RegisterFun = (mod, appApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("Arc", {
    constructor: function Arc(this: SkGgbArc, ggbLabel: string) {
      this.$ggbLabel = ggbLabel;
    },
    slots: {
      tp$new(args, kwargs) {
        return withPropertiesFromNameValuePairs(
          constructIfMatching(appApi.ggb, kCtorSignatures, "Arc", args, cls),
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
      ...labelGetSets(ggb.sharedGetSets),
      _ggb_label: ggb.sharedGetSets._ggb_label,
      _ggb_type: ggb.sharedGetSets._ggb_type,
    },
  });

  mod.Arc = cls;
  registerObjectType("arc", cls);
};
