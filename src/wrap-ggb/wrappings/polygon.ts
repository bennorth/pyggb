import { AppApi } from "../../shared/appApi";
import {
  augmentedGgbApi,
  withPropertiesFromNameValuePairs,
  WrapExistingCtorSpec,
  SkGgbObject,
  AugmentedGgbApi,
  assembledCommand,
} from "../shared";
import {
  KeywordArgsArray,
  SkObject,
  SkulptApi,
} from "../../shared/vendor-types/skulptapi";
import { registerObjectType } from "../type-registry";

declare var Sk: SkulptApi;

// TODO: If we pass an explicit list of points, we get a GGB object with
// type like "quadrilateral" or "pentagon".  Haven't tested to see how
// far this goes.  What are the consequences for, e.g., wrap-existing?

interface SkGgbPolygon extends SkGgbObject {
  ctorPointLabels: Array<string> | null;
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
      this.ctorPointLabels = null;
      switch (spec.kind) {
        case "points-array": {
          this.ctorPointLabels = spec.points.map((p) => p.$ggbLabel);
          const ggbCmd = assembledCommand("Polygon", this.ctorPointLabels);
          const lbls = ggb.evalCmd(ggbCmd).split(",");
          // TODO: Should have n.args + 1 labels here; check this.
          this.$ggbLabel = lbls[0];
          this.segments = lbls.slice(1).map(ggb.wrapExistingGgbObject);
          break;
        }
        case "two-points-n-sides": {
          const ggbCmd = assembledCommand("Polygon", [
            spec.point1.$ggbLabel,
            spec.point2.$ggbLabel,
            ggb.numberValueOrLabel(spec.nSides),
          ]);
          const lbls = ggb.evalCmd(ggbCmd).split(",");
          // TODO: Should have n.args + 1 labels here; check this.
          this.$ggbLabel = lbls[0];
          this.segments = lbls.slice(1).map(ggb.wrapExistingGgbObject);
          break;
        }
        default:
          throw new Sk.builtin.RuntimeError(
            `bad Polygon spec kind "${(spec as any).kind}"`
          );
      }
    },
    slots: {
      tp$new(args, kwargs) {
        const badArgsError = new Sk.builtin.TypeError(
          "Polygon() arguments must be" +
            " (iterable_of_points)" +
            " or (point, point, number_of_sides)"
        );

        const make = (spec: SkGgbPolygonCtorSpec) =>
          withPropertiesFromNameValuePairs(new mod.Polygon(spec), kwargs);

        switch (args.length) {
          case 1: {
            if (Sk.builtin.checkIterable(args[0])) {
              const points = Sk.misceval.arrayFromIterable(args[0]);

              if (ggb.everyElementIsGgbObject(points)) {
                return make({ kind: "points-array", points });
              }
            }

            throw badArgsError;
          }
          case 3: {
            if (
              ggb.isGgbObjectOfType(args[0], "point") &&
              ggb.isGgbObjectOfType(args[1], "point") &&
              ggb.isPythonOrGgbNumber(args[2])
            ) {
              return make({
                kind: "two-points-n-sides",
                point1: args[0],
                point2: args[1],
                nSides: args[2],
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
      // Custom implementation (i.e., do not use deleteMethodsSlice), to
      // take care of allowing the constituent points to be deleted at
      // the same time.
      delete_$rw$: {
        $flags: { FastCall: true },
        $meth(
          this: SkGgbPolygon,
          args: Array<SkObject>,
          kwargs: KeywordArgsArray
        ) {
          const [deletePoints] = Sk.abstr.copyKeywordsToNamedArgs(
            "Polygon.delete",
            ["delete_points"],
            args,
            kwargs,
            [Sk.builtin.bool.true$]
          );
          if (!Sk.builtin.checkBool(deletePoints))
            throw new Sk.builtin.ValueError("delete_points must be bool");
          ggb.deleteObject(this.$ggbLabel);
          if (deletePoints.v) {
            if (this.ctorPointLabels == null)
              throw new Sk.builtin.RuntimeError(
                "delete_points=True was given but Polygon" +
                  " was not constructed from a list of points"
              );
            this.ctorPointLabels.forEach((pointLabel) =>
              ggb.deleteObject(pointLabel)
            );
          }
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
      is_visible: ggb.sharedGetSets.is_visible,
      color: ggb.sharedGetSets.color,
      color_floats: ggb.sharedGetSets.color_floats,
      opacity: ggb.sharedGetSets.opacity,
      line_thickness: ggb.sharedGetSets.line_thickness,
      _ggb_type: ggb.sharedGetSets._ggb_type,
      // TODO: List of segments?
    },
  });

  mod.Polygon = cls;
  registerObjectType("polygon", cls);
};
