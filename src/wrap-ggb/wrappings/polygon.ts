import { AppApi } from "../../shared/appApi";
import {
  augmentedGgbApi,
  withPropertiesFromNameValuePairs,
  WrapExistingCtorSpec,
  SkGgbObject,
  AugmentedGgbApi,
} from "../shared";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";
import { registerObjectType } from "../type-registry";

declare var Sk: SkulptApi;

interface SkGgbPolygon extends SkGgbObject {
  segments: Array<SkObject>;
}

type SkGgbPolygonCtorSpec =
  | WrapExistingCtorSpec
  | {
      kind: "points-array";
      points: Array<SkGgbObject>;
    }
  | {
      kind: "two-points-n-sides";
      point1: SkGgbObject;
      point2: SkGgbObject;
      nSides: SkObject;
    };

export const register = (mod: any, appApi: AppApi) => {
  const ggb: AugmentedGgbApi = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("Polygon", {
    constructor: function Polygon(
      this: SkGgbPolygon,
      spec: SkGgbPolygonCtorSpec
    ) {
      switch (spec.kind) {
        case "points-array": {
          const ggbLabels = spec.points.map((p) => p.$ggbLabel);
          const ggbArgs = ggbLabels.join(",");
          const ggbCmd = `Polygon(${ggbArgs})`;
          const lbls = ggb.evalCmd(ggbCmd).split(",");
          // TODO: Should have n.args + 1 labels here; check this.
          this.$ggbLabel = lbls[0];
          this.segments = lbls.slice(1).map(ggb.wrapExistingGgbObject);
          break;
        }
        case "two-points-n-sides": {
          const nSidesArg = ggb.numberValueOrLabel(spec.nSides);
          const ggbArgs = `${spec.point1.$ggbLabel},${spec.point2.$ggbLabel},${nSidesArg}`;
          const ggbCmd = `Polygon(${ggbArgs})`;
          const lbls = ggb.evalCmd(ggbCmd).split(",");
          // TODO: Should have n.args + 1 labels here; check this.
          this.$ggbLabel = lbls[0];
          this.segments = lbls.slice(1).map(ggb.wrapExistingGgbObject);
          break;
        }
        default:
          throw new Sk.builtin.RuntimeError(`bad spec kind "${spec.kind}"`);
      }
    },
    slots: {
      tp$new(args, kwargs) {
        const spec = (() => {
          switch (args.length) {
            case 1:
              const points = Sk.misceval.arrayFromIterable(args[0]);
              // TODO: Check each element of points is a ggb Point.
              return { kind: "points-array", points };
            case 3:
              ggb.throwIfNotGgbObjectOfType(
                args[0],
                "point",
                "Point() ctor arg[0]"
              );
              ggb.throwIfNotGgbObjectOfType(
                args[1],
                "point",
                "Point() ctor arg[1]"
              );
              ggb.throwIfNotPyOrGgbNumber(args[2], "Point() ctor arg[2]");
              return {
                kind: "two-points-n-sides",
                point1: args[0],
                point2: args[1],
                nSides: args[2],
              };
            default:
              throw new Sk.builtin.TypeError(`bad arguments to Polygon()`);
          }
        })();
        return withPropertiesFromNameValuePairs(new mod.Polygon(spec), kwargs);
      },
    },
    methods: {
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
      color: ggb.sharedGetSets.color,
      color_ints: ggb.sharedGetSets.color_ints,
      color_floats: ggb.sharedGetSets.color_floats,
      line_thickness: ggb.sharedGetSets.line_thickness,
      _ggb_type: ggb.sharedGetSets._ggb_type,
      // TODO: List of segments?
    },
  });

  mod.Polygon = cls;
  registerObjectType("polygon", cls);
};
