import { RegisterFun } from "../../shared/appApi";
import { augmentedGgbApi, labelGetSets, SkGgbObject } from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";
import { registerObjectType } from "../type-registry";
import { constructIfMatching, SignatureSpec } from "../command-invocation";

declare var Sk: SkulptApi; // eslint-disable-line no-var

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SkGgbAngle extends SkGgbObject {}

const kCtorSignatures: Array<SignatureSpec> = [
  { argTypes: [["point", "vector", "either-number"]] },
  { argTypes: ["line", "line"] },
  { argTypes: ["vector", "vector"] },
  { argTypes: ["point", "point", "point"] },
];

export const register: RegisterFun = (mod, appApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("Angle", {
    constructor: function Angle(this: SkGgbAngle, ggbLabel: string) {
      this.$ggbLabel = ggbLabel;
    },
    slots: {
      tp$new(args) {
        return constructIfMatching(
          appApi.ggb,
          kCtorSignatures,
          "Angle",
          args,
          cls
        );
      },
      ...ggb.sharedOpSlots,
    },
    methods: {
      ...ggb.withPropertiesMethodsSlice,
    },
    getsets: {
      latex: ggb.sharedGetSets.latex,
      is_independent: ggb.sharedGetSets.is_independent,
      is_visible: ggb.sharedGetSets.is_visible,
      value: ggb.sharedGetSets.value,
      color: ggb.sharedGetSets.color,
      color_floats: ggb.sharedGetSets.color_floats,
      opacity: ggb.sharedGetSets.opacity,
      ...labelGetSets(ggb.sharedGetSets),
      _ggb_label: ggb.sharedGetSets._ggb_label,
      _ggb_type: ggb.sharedGetSets._ggb_type,
    },
  });

  mod.Angle = cls;
  registerObjectType("angle", cls);
};
