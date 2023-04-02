const isSingletonOfEmpty = (xs) => xs.length === 1 && xs[0] === "";

const kwOrDefault = (rawKwargs, k, isCorrectType, jsDefault) => {
  const kwargs = rawKwargs ?? [];
  const mIndex = kwargs.findIndex((x, i) => i % 2 === 0 && x === k);
  console.log(kwargs, k, mIndex);
  if (mIndex === -1) return jsDefault;
  const value = kwargs[mIndex + 1];
  if (!isCorrectType(value)) throw Sk.builtin.TypeError("bad arg type");
  return Sk.ffi.remapToJs(value);
};

const kwNumber = (kwargs, k, jsDefault) => {
  return kwOrDefault(kwargs, k, Sk.builtin.checkNumber, jsDefault);
};

const kwBoolean = (kwargs, k, jsDefault) => {
  return kwOrDefault(kwargs, k, Sk.builtin.checkBool, jsDefault);
};

const PYGGB_CYPRESS = () => {
  if (window.PYGGB_CYPRESS == null) window.PYGGB_CYPRESS = {};
  return window.PYGGB_CYPRESS;
};

function $builtinmodule() {
  const appApi = globalThis.$appApiHandoverQueue.dequeue();
  return globalThis.$skulptGgbModule(appApi);
  /*
  const ggbApi = appApi.ggb;
  const skApi = appApi.sk;
  const uiApi = appApi.ui;

  PYGGB_CYPRESS().GGB_API = ggbApi;

  let mod = {};

  mod.Slider = Sk.abstr.buildNativeClass("Slider", {
    constructor: function Slider(spec) {
      const ggbArgs = [
        strOfNumber(spec.min),
        strOfNumber(spec.max),
        strOfNumber(spec.increment),
        strOfNumber(spec.speed),
        strOfNumber(spec.width),
        strOfBool(spec.isAngle),
        strOfBool(spec.isHorizontal),
        strOfBool(spec.isAnimating),
        strOfBool(spec.isRandom),
      ].join(",");

      const ggbCmd = `Slider(${ggbArgs})`;
      const lbl = ggbApi.evalCommandGetLabels(ggbCmd);
      console.log(ggbCmd, lbl);
      this.$ggbLabel = lbl;
    },
    slots: {
      tp$new(args, kwargs) {
        if (args.length !== 2)
          throw new Sk.builtin.TypeError("bad Slider() args; need 2 args");

        const bothNumbers = args.every(Sk.builtin.checkNumber);
        if (!bothNumbers)
          throw new Sk.builtin.TypeError(
            "bad Slider() args; args must be numbers"
          );

        const spec = {
          min: args[0].v,
          max: args[1].v,
          increment: kwNumber(kwargs, "increment", 0.1),
          speed: kwNumber(kwargs, "speed", 1.0),
          width: kwNumber(kwargs, "width", 100),
          isAngle: kwBoolean(kwargs, "isAngle", false),
          isHorizontal: kwBoolean(kwargs, "isHorizontal", true),
          isAnimating: kwBoolean(kwargs, "isAnimating", false),
          isRandom: kwBoolean(kwargs, "isRandom", false),
        };

        return new mod.Slider(spec);
      },
    },
  });

  // TODO: Is this the best way to handle intersections?  Could instead
  // run command
  //
  //     {Intersect(⋯)}
  //
  // (i.e., wrapped in {}s), which gives us a dynamic GGB list.  Would
  // then really have to wrap normal Python sequence operations to this
  // object, which could only be done imperfectly.  E.g., Python
  // sorted(⋯) always returns a native Python list.
  //
  mod.Intersect = new Sk.builtin.func((...args) => {
    if (args.length !== 2 || !args.every((x) => isGgbObject(x)))
      throw new Sk.builtin.TypeError(
        "bad Intersect() args; need 2 Geogebra objects"
      );

    const ggbArgs = `${args[0].$ggbLabel},${args[1].$ggbLabel}`;
    const ggbCmd = `Intersect(${ggbArgs})`;
    const commandResponse = ggbApi.evalCommandGetLabels(ggbCmd);

    // TODO: Handle null response, e.g., if you try to Intersect two points.

    const rawLabels = commandResponse.split(",");

    // TODO: Seem to get back a label even if given objects do not intersect.
    // How to handle this?  Do we actually need the isSingletonOfEmpty() call?
    const labels = isSingletonOfEmpty(rawLabels) ? [] : rawLabels;

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

  const namesForExport = Sk.ffi.remapToPy([
    "Number",
    "Boolean",
    "Point",
    "Circle",
    "Line",
    "Vector",
    "Segment",
    "Polygon",
    "Parabola",
    // "Slider",  // This is not ready for use yet.
    "Distance",
    "Intersect",
    "Rotate",
    "Function",
    "If",
    "ClearConsole",
  ]);

  mod.__name__ = new Sk.builtin.str("ggb");
  mod.__all__ = namesForExport;

  return mod;
*/
}
