import { AppApi } from "../../shared/appApi";
import {
  augmentedGgbApi,
  isInstance,
  withPropertiesFromNameValuePairs,
  WrapExistingCtorSpec,
  SkGgbObject,
} from "../shared";
import { SkulptApi } from "../skulptapi";

import { registerObjectType } from "../type-registry";

declare var Sk: SkulptApi;

interface SkGgbSegment extends SkGgbObject {
  point1?: SkGgbObject;
  point2?: SkGgbObject;
}

type SkGgbSegmentCtorSpec =
  | WrapExistingCtorSpec
  | {
      kind: "new-from-points";
      point1: SkGgbObject;
      point2: SkGgbObject;
    };

export const register = (mod: any, appApi: AppApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("Segment", {
    constructor: function Segment(
      this: SkGgbSegment,
      spec: SkGgbSegmentCtorSpec
    ) {
      switch (spec.kind) {
        case "new-from-points":
          const ggbArgs = `${spec.point1.$ggbLabel},${spec.point2.$ggbLabel}`;
          const ggbCmd = `Segment(${ggbArgs})`;
          const lbl = ggb.evalCmd(ggbCmd);
          this.$ggbLabel = lbl;
          this.point1 = spec.point1;
          this.point2 = spec.point2;
          break;
        case "wrap-existing":
          this.$ggbLabel = spec.label;
          // TODO: Can we reliably parse ggbApi.getDefinitionString() output to
          // recover the two points?  Do we need to keep a registry of which GGB
          // objects we have already wrapped for Python use?
          //
          // Can get from GGB with Point(SEGMENT, 0) and Point(SEGMENT, 1).
          break;
        default:
          throw new Sk.builtin.TypeError(
            `bad Segment() spec.kind "${(spec as any).kind}"`
          );
      }
    },
    slots: {
      tp$new(args, kwargs) {
        if (args.length !== 2 || !args.every(isInstance(mod.Point)))
          throw new Sk.builtin.TypeError("bad Segment() args: need 2 Points");
        const spec = {
          kind: "new-from-points",
          point1: args[0],
          point2: args[1],
        };
        return withPropertiesFromNameValuePairs(new mod.Segment(spec), kwargs);
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
      color: ggb.sharedGetSets.color,
      line_thickness: ggb.sharedGetSets.line_thickness,
    },
  });

  mod.Segment = cls;
  registerObjectType("segment", cls);
};
