import { AppApi } from "../../shared/appApi";
import {
  AugmentedGgbApi,
  augmentedGgbApi,
  isSingletonOfEmpty,
} from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi;

// TODO: Is this the best way to handle intersections?  Could instead
// run command
//
//     {Intersect(⋯)}
//
// (i.e., wrapped in {}s), which gives us a dynamic GGB list.  Would
// then really have to wrap normal Python sequence operations to this
// object, which could only be done imperfectly.  E.g., Python sorted(⋯)
// always returns a native Python list.

export const register = (mod: any, appApi: AppApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const fun = new Sk.builtin.func((...args) => {
    const badArgsError = new Sk.builtin.TypeError(
      "Intersect() arguments must be two Geogebra objects and a number"
    );

    if (
      args.length !== 3 ||
      !ggb.isGgbObject(args[0]) ||
      !ggb.isGgbObject(args[1]) ||
      !ggb.isPythonOrGgbNumber(args[2])
    ) {
      throw badArgsError;
    }

    const ggbArgs = [
      args[0].$ggbLabel,
      args[1].$ggbLabel,
      ggb.numberValueOrLabel(args[2]),
    ];
    const ggbCmd = `Intersect(${ggbArgs.join(",")})`;

    // It seems that always get a Point.  If there is no Nth
    // intersection, the Point has NaN coords.
    const label = ggb.evalCmd(ggbCmd);

    return ggb.wrapExistingGgbObject(label);

    // TODO: Will we always get Points back?  Assert this?  Do we need to
    // distinguish between free and derived points?  What happens if when we
    // initially Intersect a Segment and a Polygon, they don't intersect, but
    // then I drag one end of the Segment such that it intersects the Polygon
    // twice.  The "Intersection" object does what?  Looks like it tracks one of
    // the intersection points.  Both intersections are shown on the
    // construction though.
    //
    // If you intersect two Segments which are collinear and overlap, you get
    // back a NaN,Nan point.
    //
    // Not clear what a good user experience here is.  Doesn't fit so well with
    // Python's idea of doing a calculation and getting a result.

    // Not sure why we get a label "null" when intersecting two circles,
    // but exclude such labels.
    const points = labels
      .filter((lbl) => lbl !== "null")
      .map((label) => new mod.Point({ kind: "wrap-existing", label }));

    return new Sk.builtin.list(points);
  });

  mod.Intersect = fun;
};
