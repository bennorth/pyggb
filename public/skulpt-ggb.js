const strOfBool = (x) => x.toString();

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

  const throwIfNotGgb = (obj, objName) => {
    // This might not always be the right test, but it is for now:
    if (!isGgbObject(obj))
      throw new Sk.builtin.TypeError(`${objName} must be a GeoGebra object`);
  };

  mod.Circle = Sk.abstr.buildNativeClass("Circle", {
    constructor: function Circle(spec) {
      // TODO: This is messy; tidy up:
      if (spec.kind === "wrap-existing") {
        this.$ggbLabel = spec.label;
        this.radiusNumber = null;
        return;
      }

      const ggbArgs = (() => {
        switch (spec.kind) {
          case "center-radius": {
            const radiusArg = numberValueOrLabel(spec.radius);
            return `${spec.center.$ggbLabel},${radiusArg}`;
          }
          case "center-point":
            return `${spec.center.$ggbLabel},${spec.point.$ggbLabel}`;
          case "3-points":
            return spec.points.map((p) => p.$ggbLabel).join(",");
          default:
            throw new Sk.builtin.RuntimeError("should not get here");
        }
      })();
      const ggbCmd = `Circle(${ggbArgs})`;
      const lbl = ggbApi.evalCommandGetLabels(ggbCmd);
      this.$ggbLabel = lbl;
      this.radiusNumber = null;
    },
    proto: {
      $radiusNumber() {
        if (this.radiusNumber == null) {
          const ggbCmd = `Radius(${this.$ggbLabel})`;
          const label = ggbApi.evalCommandGetLabels(ggbCmd);
          this.radiusNumber = new mod.Number({ kind: "wrap-existing", label });
        }
        return this.radiusNumber;
      },
    },
    slots: {
      tp$new(args, kwargs) {
        const spec = (() => {
          switch (args.length) {
            case 2:
              if (!Sk.builtin.isinstance(args[0], mod.Point).v) {
                throw new Sk.builtin.TypeError(
                  `bad Circle() ctor arg[0] not Point`
                );
              }
              if (isPythonOrGgbNumber(args[1])) {
                return {
                  kind: "center-radius",
                  center: args[0],
                  radius: args[1],
                };
              }
              if (Sk.builtin.isinstance(args[1], mod.Point).v) {
                return {
                  kind: "center-point",
                  center: args[0],
                  point: args[1],
                };
              }
              // TODO: isinstance(args[1], mod.Segment)
              throw new Sk.builtin.TypeError(`bad Circle() ctor args`);
            case 3:
              const allPoints = args.every(
                (arg) => Sk.builtin.isinstance(arg, mod.Point).v
              );
              if (allPoints) {
                return {
                  kind: "3-points",
                  points: args,
                };
              }

              const allNumbers = args.every(isPythonOrGgbNumber);
              if (allNumbers) {
                return {
                  kind: "center-radius",
                  center: new mod.Point({
                    kind: "new-from-coords",
                    x: numberValueOrLabel(args[0]),
                    y: numberValueOrLabel(args[1]),
                  }),
                  radius: args[2],
                };
              }
              throw new Sk.builtin.TypeError(`bad Circle() ctor args`);

            default:
              throw new Sk.builtin.TypeError(`bad Circle() ctor args`);
          }
        })();

        return withPropertiesFromNameValuePairs(new mod.Circle(spec), kwargs);
      },
    },
    methods: {
      ...kWithPropertiesMethodsSlice,
      ...kWithFreeCopyMethodsSlice,
    },
    getsets: {
      color: sharedGetSets.color,
      line_thickness: sharedGetSets.line_thickness,
      radius: {
        $get() {
          return new Sk.builtin.float_(this.$radiusNumber().$value());
        },
      },
      radius_number: {
        $get() {
          return this.$radiusNumber();
        },
      },
    },
  });

  mod.Line = Sk.abstr.buildNativeClass("Line", {
    constructor: function Line(spec) {
      // TODO: This is messy; tidy up:
      if (spec.kind === "wrap-existing") {
        this.$ggbLabel = spec.label;
        return;
      }

      const ggbArgs = (() => {
        switch (spec.kind) {
          case "point-point":
            return spec.points.map((p) => p.$ggbLabel).join(",");
          default:
            throw new Sk.builtin.RuntimeError("should not get here");
        }
      })();
      const ggbCmd = `Line(${ggbArgs})`;
      const lbl = ggbApi.evalCommandGetLabels(ggbCmd);
      this.$ggbLabel = lbl;
    },
    slots: {
      tp$new(args, _kwargs) {
        const spec = (() => {
          if (args.length !== 2) {
            throw new Sk.builtin.TypeError("bad Line() args; need 2 args");
          }

          if (!Sk.builtin.isinstance(args[0], mod.Point).v) {
            throw new Sk.builtin.TypeError("bad Line() args; first not Point");
          }

          if (Sk.builtin.isinstance(args[1], mod.Point).v) {
            return {
              kind: "point-point",
              points: args,
            };
          }

          throw new Sk.builtin.TypeError(
            "bad Line() args; unhandled type of second"
          );
        })();
        return new mod.Line(spec);
      },
    },
    methods: {
      ...kWithFreeCopyMethodsSlice,
    },
  });

  mod.Number = Sk.abstr.buildNativeClass("Number", {
    constructor: function Number(spec) {
      switch (spec.kind) {
        case "literal":
          const ggbCmd = strOfNumber(spec.value);
          const label = ggbApi.evalCommandGetLabels(ggbCmd);
          this.$ggbLabel = label;
          break;
        case "wrap-existing":
          this.$ggbLabel = spec.label;
          break;
        default:
          throw new Sk.builtin.TypeError(
            `bad spec.kind "${spec.kind}" for Number`
          );
      }
    },
    slots: {
      tp$new(args, kwargs) {
        throwIfNotNumber(args[0]);
        return new mod.Number({ kind: "literal", value: args[0].v });
      },
      ...sharedOpSlots,
    },
    proto: {
      $value() {
        return ggbApi.getValue(this.$ggbLabel);
      },
    },
    methods: {
      ...kWithFreeCopyMethodsSlice,
    },
    getsets: {
      value: {
        $get() {
          // TODO: Consider cache so get self-same Python float every time.
          return new Sk.builtin.float_(this.$value());
        },
        $set(pyValue) {
          // TODO: Get numeric value more robustly.
          ggbApi.setValue(this.$ggbLabel, pyValue.v);
        },
      },
    },
  });

  mod.Boolean = Sk.abstr.buildNativeClass("Boolean", {
    constructor: function Boolean(spec) {
      switch (spec.kind) {
        case "literal":
          const ggbCmd = spec.value ? "true" : "false";
          const label = ggbApi.evalCommandGetLabels(ggbCmd);
          this.$ggbLabel = label;
          break;
        case "wrap-existing":
          this.$ggbLabel = spec.label;
          break;
        default:
          throw new Sk.builtin.TypeError(
            `bad spec.kind "${spec.kind}" for Boolean`
          );
      }
    },
    slots: {
      tp$new(args, _kwargs) {
        // TODO: Check for exactly one arg.
        const value = Sk.misceval.isTrue(args[0]);
        return new mod.Boolean({ kind: "literal", value });
      },
    },
    methods: {
      ...kWithFreeCopyMethodsSlice,
    },
    getsets: {
      value: {
        $get() {
          return new Sk.builtin.bool(ggbApi.getValue(this.$ggbLabel));
        },
        $set(pyValue) {
          const value = Sk.misceval.isTrue(pyValue);
          ggbApi.setValue(this.$ggbLabel, value);
        },
      },
    },
  });

  mod.Vector = Sk.abstr.buildNativeClass("Vector", {
    constructor: function Vector(spec) {
      switch (spec.kind) {
        case "points": {
          const ggbArgs = `${spec.point1.$ggbLabel},${spec.point2.$ggbLabel}`;
          const ggbCmd = `Vector(${ggbArgs})`;
          const lbl = ggbApi.evalCommandGetLabels(ggbCmd);
          this.$ggbLabel = lbl;
          break;
        }
        case "components": {
          const e1Arg = numberValueOrLabel(spec.e1);
          const e2Arg = numberValueOrLabel(spec.e2);
          const ggbArgs = `${e1Arg},${e2Arg}`;
          const ggbCmd = `Vector((${ggbArgs}))`;
          const lbl = ggbApi.evalCommandGetLabels(ggbCmd);
          this.$ggbLabel = lbl;
          break;
        }
        case "wrap-existing":
          this.$ggbLabel = spec.label;
          break;
        default:
          throw new Sk.builtin.TypeError(
            `bad Vector() spec.kind "${spec.kind}"`
          );
      }
    },
    slots: {
      tp$new(args, kwargs) {
        const rawVector = (() => {
          if (args.length === 2 && args.every(isInstance(mod.Point))) {
            const spec = { kind: "points", point1: args[0], point2: args[1] };
            return new mod.Vector(spec);
          }

          if (args.length === 2 && args.every(isPythonOrGgbNumber)) {
            const spec = { kind: "components", e1: args[0], e2: args[1] };
            return new mod.Vector(spec);
          }

          throw new Sk.builtin.TypeError(
            "bad Vector() args: need 2 Points or 2 numbers"
          );
        })();

        return withPropertiesFromNameValuePairs(rawVector, kwargs);
      },
      ...sharedOpSlots,
    },
    methods: {
      ...kWithPropertiesMethodsSlice,
      ...kWithFreeCopyMethodsSlice,
    },
    getsets: {
      is_visible: sharedGetSets.is_visible,
      is_independent: sharedGetSets.is_independent,
    },
  });

  mod.Segment = Sk.abstr.buildNativeClass("Segment", {
    constructor: function Segment(spec) {
      switch (spec.kind) {
        case "new-from-points":
          const ggbArgs = `${spec.point1.$ggbLabel},${spec.point2.$ggbLabel}`;
          const ggbCmd = `Segment(${ggbArgs})`;
          const lbl = ggbApi.evalCommandGetLabels(ggbCmd);
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
            `bad Segment() spec.kind "${spec.kind}"`
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
      ...kWithFreeCopyMethodsSlice,
    },
    getsets: {
      // "length" is reserved word for Skulpt, so the property must be
      // set up with this mangled name:
      length_$rw$: {
        $get() {
          return new Sk.builtin.float_(ggbApi.getValue(this.$ggbLabel));
        },
      },
      color: sharedGetSets.color,
      line_thickness: sharedGetSets.line_thickness,
    },
  });

  mod.Polygon = Sk.abstr.buildNativeClass("Polygon", {
    constructor: function Polygon(spec) {
      switch (spec.kind) {
        case "points-array": {
          const ggbLabels = spec.points.map((p) => p.$ggbLabel);
          const ggbArgs = ggbLabels.join(",");
          const ggbCmd = `Polygon(${ggbArgs})`;
          const lbls = ggbApi.evalCommandGetLabels(ggbCmd).split(",");
          // TODO: Should have n.args + 1 labels here; check this.
          this.$ggbLabel = lbls[0];
          this.segments = lbls.slice(1).map(wrapDependent);
          break;
        }
        case "two-points-n-sides": {
          const nSidesArg = numberValueOrLabel(spec.nSides);
          const ggbArgs = `${spec.point1.$ggbLabel},${spec.point2.$ggbLabel},${nSidesArg}`;
          const ggbCmd = `Polygon(${ggbArgs})`;
          const lbls = ggbApi.evalCommandGetLabels(ggbCmd).split(",");
          // TODO: Should have n.args + 1 labels here; check this.
          this.$ggbLabel = lbls[0];
          this.segments = lbls.slice(1).map(wrapDependent);
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
              if (
                args.slice(0, 2).every(isInstance(mod.Point)) &&
                isPythonOrGgbNumber(args[2])
              )
                return {
                  kind: "two-points-n-sides",
                  point1: args[0],
                  point2: args[1],
                  nSides: args[2],
                };
              throw new Sk.builtin.TypeError(
                "Polygon(): if 3 args, must be point, point, n"
              );
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
          return new Sk.builtin.float_(ggbApi.getValue(this.$ggbLabel));
        },
      },
      color: sharedGetSets.color,
      line_thickness: sharedGetSets.line_thickness,
      // TODO: List of segments?
    },
  });

  mod.Parabola = Sk.abstr.buildNativeClass("Parabola", {
    constructor: function Parabola(spec) {
      // TODO: This is messy; tidy up:
      if (spec.kind === "wrap-existing") {
        this.$ggbLabel = spec.label;
        return;
      }

      switch (spec.kind) {
        case "focus-directrix":
          // TODO: Check focus is a point and directrix is a line.  Where does
          // that check belong?
          const ggbArgs = `${spec.focus.$ggbLabel},${spec.directrix.$ggbLabel}`;
          const ggbCmd = `Parabola(${ggbArgs})`;
          const lbl = ggbApi.evalCommandGetLabels(ggbCmd);
          this.$ggbLabel = lbl;
          this.focus = spec.focus;
          this.directrix = spec.directrix;
          console.log("Made Parabola?", lbl, spec);
          break;
        default:
          throw new Sk.builtin.RuntimeError(
            `bad Parabola spec.kind "${spec.kind}"`
          );
      }
    },
    slots: {
      tp$new(args, _kwargs) {
        if (args.length !== 2)
          throw new Sk.builtin.TypeError("expected 2 args for Parabola()");
        if (!isInstance(mod.Point)(args[0]) || !isInstance(mod.Line)(args[1]))
          throw new Sk.builtin.TypeError("args must be point, line");
        return new mod.Parabola({
          kind: "focus-directrix",
          focus: args[0],
          directrix: args[1],
        });
      },
    },
    methods: {
      ...kWithFreeCopyMethodsSlice,
    },
  });

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

  mod.Distance = new Sk.builtin.func((...args) => {
    if (args.length !== 2)
      throw new Sk.builtin.TypeError("bad Distance() args; need 2 args");
    if (!Sk.builtin.isinstance(args[0], mod.Point).v) {
      throw new Sk.builtin.TypeError(`bad Distance() ctor arg[0] not Point`);
    }
    throwIfNotGgb(args[1], "Distance() ctor arg[1]");

    const ggbArgs = `${args[0].$ggbLabel},${args[1].$ggbLabel}`;
    const ggbCmd = `Distance(${ggbArgs})`;
    const lbl = ggbApi.evalCommandGetLabels(ggbCmd);
    const distanceValue = ggbApi.getValue(lbl);
    ggbApi.deleteObject(lbl);
    return new Sk.builtin.float_(distanceValue);
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

  mod.Rotate = new Sk.builtin.func((...args) => {
    if (args.length !== 2 || !isGgbObject(args[0]))
      throw new Sk.builtin.TypeError("need 2 args to Rotate()");
    const angleArg = (() => {
      const pyAngle = args[1];
      if (isPythonOrGgbNumber(pyAngle)) {
        return numberValueOrLabel(pyAngle);
      }
      throw new Sk.builtin.TypeError("angle arg must be ggb Numeric or number");
    })();

    const ggbArgs = `${args[0].$ggbLabel},${angleArg}`;
    const ggbCmd = `Rotate(${ggbArgs})`;
    const label = ggbApi.evalCommandGetLabels(ggbCmd);
    return wrapDependent(label);
  });

  mod.If = new Sk.builtin.func((...args) => {
    // TODO: Allow literals as well?
    if (!args.every((x) => isGgbObject(x))) {
      console.error(args);
      throw new Sk.builtin.TypeError("all args must be GGB objects");
    }
    const ggbArgs = args.map((obj) => obj.$ggbLabel).join(",");
    const ggbCmd = `If(${ggbArgs})`;
    const label = ggbApi.evalCommandGetLabels(ggbCmd);
    return wrapDependent(label);
  });

  // Is the following reasonable?  It bundles various pre-defined GGB functions
  // into a Function object, so user-level code ends up as, e.g.,
  //
  // x = Function.sin(th)
  //
  // where th is a ggb Number and therefore x is also.

  const functionWrapperSlice = (ggbName) => {
    return {
      [ggbName]: {
        $meth(x) {
          // TODO: If given a Python number, evaluate in Python; if a ggb
          // Number, evaluate as dependent Number.
          const ggbCmd = `${ggbName}(${x.$ggbLabel})`;
          const label = ggbApi.evalCommandGetLabels(ggbCmd);
          console.log("FUNC", x, ggbCmd, label);
          return wrapDependent(label);
        },
        $flags: { OneArg: true },
      },
    };
  };

  const cls_Function = Sk.abstr.buildNativeClass("Function", {
    constructor: function Function() {},
    methods: {
      ...functionWrapperSlice("sin"),
      ...functionWrapperSlice("cos"),
      compare_LT: {
        $flags: { FastCall: true },
        $meth(args, _kwargs) {
          // TODO: Check no kwargs.
          return ggbCompare(args[0], args[1], "<");
        },
      },
    },
  });

  mod.Function = new cls_Function();

  mod.ClearConsole = new Sk.builtin.func((...args) => {
    if (args.length !== 0)
      throw new Sk.builtin.TypeError("bad ClearConsole() args; need 0 args");
    uiApi.clearConsole();
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
