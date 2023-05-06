import { AppApi } from "../../shared/appApi";
import { augmentedGgbApi } from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi;

// The right way to present Intersect() to Python is not obvious.  The
// native Ggb return value is a list/array, which we could wrap in a
// sequence-like object to Python.  This would have the advantage of
// letting the list of intersection points update as the intersecting
// objects move.  However, some Python operations on sequences e.g.,
// sorted(), return actual Python lists so at that point we'd lose the
// tie to the native Ggb array of intersections.  For v1, we settled on
// only supporting the Intersect(p, q, n) form of the Ggb function.

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
  });

  mod.Intersect = fun;
};
