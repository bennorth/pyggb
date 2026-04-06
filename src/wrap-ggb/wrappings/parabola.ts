import { RegisterFun } from "../../shared/appApi";
import {
  augmentedGgbApi,
  SkGgbObject,
  AugmentedGgbApi,
  withPropertiesFromNameValuePairs,
  labelGetSets,
  tpCallFun,
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
interface SkGgbParabola extends SkGgbObject {}

const makeCoeffsCommand = (ggb: GgbApi, args: Array<SkObject>) => {
  const argStrs = args.map((arg) => ggbArgumentStr(ggb, arg));
  return `y=(${argStrs[0]})x^2 + (${argStrs[1]})x + (${argStrs[2]})`;
};

const kCtorSignatures: Array<SignatureSpec> = [
  { argTypes: ["point", "line"] },
  {
    argTypes: ["either-number", "either-number", "either-number"],
    ggbCommand: makeCoeffsCommand,
  },
];

export const register: RegisterFun = (mod, appApi) => {
  const ggb: AugmentedGgbApi = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("Parabola", {
    constructor: function Parabola(this: SkGgbParabola, ggbLabel: string) {
      this.$ggbLabel = ggbLabel;
    },
    slots: {
      tp$new(args, kwargs) {
        return withPropertiesFromNameValuePairs(
          constructIfMatching(
            appApi.ggb,
            kCtorSignatures,
            "Parabola",
            args,
            cls
          ),
          kwargs
        );
      },
      tp$call: tpCallFun(ggb, "Parabola"),
    },
    methods: {
      ...ggb.freeCopyMethodsSlice,
    },
    getsets: {
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

  mod.Parabola = cls;
  registerObjectType("parabola", cls);
};
