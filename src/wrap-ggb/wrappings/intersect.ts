import { RegisterFun } from "../../shared/appApi";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";
import { SignatureSpec, wrapIfMatching } from "../command-invocation";

declare var Sk: SkulptApi; // eslint-disable-line no-var

// The right way to present Intersect() to Python is not obvious.  The
// native Ggb return value is a list/array, which we could wrap in a
// sequence-like object to Python.  This would have the advantage of
// letting the list of intersection points update as the intersecting
// objects move.  However, some Python operations on sequences e.g.,
// sorted(), return actual Python lists so at that point we'd lose the
// tie to the native Ggb array of intersections.  For v1, we settled on
// only supporting the Intersect(p, q, n) form of the Ggb function.

const kSignatures: Array<SignatureSpec> = [
  { argTypes: ["ggb-object", "ggb-object"], returnsMultiple: "take-all" },
  { argTypes: ["ggb-object", "ggb-object", ["either-number", "point"]] },
];

export const register: RegisterFun = (mod, appApi) => {
  mod.Intersect = new Sk.builtin.func((...args) =>
    wrapIfMatching(appApi.ggb, kSignatures, "Intersect", args)
  );

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
};
