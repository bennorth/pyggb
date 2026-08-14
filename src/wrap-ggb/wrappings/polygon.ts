import { RegisterFun } from "../../shared/appApi";
import {
  augmentedGgbApi,
  withPropertiesFromNameValuePairs,
  SkGgbObject,
  AugmentedGgbApi,
  assembledCommand,
  labelGetSets,
  kPolygonTypeAndSubtypes,
} from "../shared";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";
import { registerObjectType } from "../type-registry";
import {
  constructIfMatching,
  ggbArgumentStrsFromIterable,
  SignatureSpec,
} from "../command-invocation";
import { GgbApi } from "../../shared/vendor-types/ggbapi";

declare var Sk: SkulptApi; // eslint-disable-line no-var

// TODO: If we pass an explicit list of points, we get a GGB object with
// type like "quadrilateral" or "pentagon".  Haven't tested to see how
// far this goes.  What are the consequences for, e.g., wrap-existing?

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SkGgbPolygon extends SkGgbObject {}

const makePointIterableCommand = (ggb: GgbApi, args: Array<SkObject>) => {
  const pointLbls = ggbArgumentStrsFromIterable(ggb, args[0]);
  return assembledCommand("Polygon", pointLbls);
};

const kCtorSignatures: Array<SignatureSpec> = [
  {
    argTypes: ["point", "point", "either-number"],
    returnsMultiple: "take-first",
  },
  {
    argTypes: [{ kind: "iterable", elementType: "point" }],
    ggbCommand: makePointIterableCommand,
    returnsMultiple: "take-first",
  },
];

export const register: RegisterFun = (mod, appApi) => {
  const ggb: AugmentedGgbApi = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("Polygon", {
    constructor: function Polygon(this: SkGgbPolygon, ggbLabel: string) {
      this.$ggbLabel = ggbLabel;
    },
    slots: {
      tp$new(args, kwargs) {
        return withPropertiesFromNameValuePairs(
          constructIfMatching(
            appApi.ggb,
            kCtorSignatures,
            "Polygon",
            args,
            cls
          ),
          kwargs
        );
      },
    },
    methods: {
      angles: {
        $flags: { NoArgs: true },
        $meth(this: SkGgbPolygon) {
          const angleLabels = ggb
            .evalCmdWithGgbArgs("Angle", [this])
            .split(",");
          return new Sk.builtin.list(
            angleLabels.map(ggb.wrapExistingGgbObject)
          );
        },
      },
      // TODO: Any insight into why CopyFreeObject(poly) gives a number?
      // Until then, leave this disabled:
      //
      // ...kWithFreeCopyMethodsSlice,
    },
    getsets: {
      area: {
        $get() {
          return new Sk.builtin.float_(ggb.getValue(this.$ggbLabel));
        },
      },
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
      // TODO: List of segments?
    },
  });

  mod.Polygon = cls;
  kPolygonTypeAndSubtypes.forEach((typeName) => {
    registerObjectType(typeName, cls);
  });
};
