import { AppApi } from "../../shared/appApi";
import {
  augmentedGgbApi,
  withPropertiesFromNameValuePairs,
  WrapExistingCtorSpec,
  SkGgbObject,
} from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";

import { registerObjectType } from "../type-registry";

declare var Sk: SkulptApi;

interface SkGgbSegment extends SkGgbObject {
  point1?: SkGgbObject;
  point2?: SkGgbObject;
}

type SkGgbSegmentCtorSpec =
  | WrapExistingCtorSpec
  | {
      kind: "two-points";
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
        case "wrap-existing":
          this.$ggbLabel = spec.label;
          // TODO: Can we reliably parse ggbApi.getDefinitionString() output to
          // recover the two points?  Do we need to keep a registry of which GGB
          // objects we have already wrapped for Python use?
          //
          // Can get from GGB with Point(SEGMENT, 0) and Point(SEGMENT, 1).
          break;
        case "two-points":
          const ggbArgs = `${spec.point1.$ggbLabel},${spec.point2.$ggbLabel}`;
          const ggbCmd = `Segment(${ggbArgs})`;
          const lbl = ggb.evalCmd(ggbCmd);
          this.$ggbLabel = lbl;
          this.point1 = spec.point1;
          this.point2 = spec.point2;
          break;
        default:
          throw new Sk.builtin.TypeError(
            `bad Segment() spec.kind "${(spec as any).kind}"`
          );
      }
    },
    slots: {
      tp$new(args, kwargs) {
        const badArgsError = new Sk.builtin.TypeError(
          "Segment() arguments must be (point, point)"
        );

        const make = (spec: SkGgbSegmentCtorSpec) =>
          withPropertiesFromNameValuePairs(new mod.Segment(spec), kwargs);

        switch (args.length) {
          case 2: {
            if (ggb.everyElementIsGgbObjectOfType(args, "point")) {
              return make({
                kind: "two-points",
                point1: args[0],
                point2: args[1],
              });
            }

            throw badArgsError;
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
      // "length" is reserved word for Skulpt, so the property must be
      // set up with this mangled name:
      length_$rw$: {
        $get(this: SkGgbSegment) {
          return new Sk.builtin.float_(ggb.getValue(this.$ggbLabel));
        },
      },
      color: ggb.sharedGetSets.color,
      color_floats: ggb.sharedGetSets.color_floats,
      line_thickness: ggb.sharedGetSets.line_thickness,
      _ggb_type: ggb.sharedGetSets._ggb_type,
    },
  });

  mod.Segment = cls;
  registerObjectType("segment", cls);
};
