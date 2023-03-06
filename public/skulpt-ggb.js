const strOfNumber = (x) => {
  const jsStr = x.toExponential();
  const [sig, exp] = jsStr.split("e");
  return `(${sig}*10^(${exp}))`;
};

const strOfBool = (x) => x.toString();

// Requires existence of map on globalThis.
const tryParseColor = (rawColor) => {
  const lcColor = rawColor.toLowerCase();
  const mHex = globalThis.$hexRgbFromNamedColour.get(lcColor);
  const color = mHex ?? lcColor;

  const mMatch6 = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/.exec(color);
  if (mMatch6 != null)
    return [
      parseInt(mMatch6[1], 16),
      parseInt(mMatch6[2], 16),
      parseInt(mMatch6[3], 16),
    ];

  const mMatch3 = /^#([0-9a-f]{1})([0-9a-f]{1})([0-9a-f]{1})$/.exec(color);
  if (mMatch3 != null)
    return [
      0x11 * parseInt(mMatch3[1], 16),
      0x11 * parseInt(mMatch3[2], 16),
      0x11 * parseInt(mMatch3[3], 16),
    ];

  return null;
};

const parseColorOrFail = (color) => {
  const mRGB = tryParseColor(color);
  if (mRGB == null)
    throw new Sk.builtin.ValueError(`the color "${color}" is not recognised`);
  return mRGB;
};

const isGgbObject = (obj) => Object.hasOwn(obj, "$ggbLabel");

const throwIfNotGgb = (obj, objName) => {
  // This might not always be the right test, but it is for now:
  if (!isGgbObject(obj))
    throw new Sk.builtin.TypeError(`${objName} must be a GeoGebra object`);
};

const throwIfNotNumber = (pyObj, objName) => {
  if (!Sk.builtin.checkNumber(pyObj))
    throw new Sk.builtin.TypeError(`${objName} must be a number`);
};

const isInstance = (cls) => (obj) => Sk.builtin.isinstance(obj, cls).v;

function $builtinmodule() {
  const appApi = globalThis.$appApiHandoverQueue.dequeue();
  const ggbApi = appApi.ggb;
  const skApi = appApi.sk;

  let mod = {};

  mod.Point = Sk.abstr.buildNativeClass("Point", {
    constructor: function Point(spec) {
      switch (spec.kind) {
        case "new-from-coords":
          const cmd = `(${strOfNumber(spec.x)}, ${strOfNumber(spec.y)})`;
          const lbl = ggbApi.evalCommandGetLabels(cmd);

          this.$ggbLabel = lbl;
          break;
        default:
          throw new Sk.builtin.TypeError(
            `bad Point() spec.kind "${spec.kind}"`
          );
      }

      this.$updateHandlers = [];
      ggbApi.registerObjectUpdateListener(this.$ggbLabel, () =>
        this.$fireUpdateEvents()
      );
    },
    slots: {
      tp$new(args, kwargs) {
        Sk.abstr.checkNoKwargs("Point", kwargs);
        Sk.abstr.checkArgsLen("Point", args, 2, 2);
        const x = Sk.ffi.remapToJs(args[0]);
        const y = Sk.ffi.remapToJs(args[1]);
        return new mod.Point({ kind: "new-from-coords", x, y });
      },
      tp$str() {
        return new Sk.builtin.str(`(${this.$xCoord()}, ${this.$yCoord()})`);
      },
      $r() {
        return new Sk.builtin.str(
          `Point(${this.$xCoord()}, ${this.$yCoord()})`
        );
      },
    },
    proto: {
      $xCoord() {
        return ggbApi.getXcoord(this.$ggbLabel);
      },
      $setXCoord(x) {
        // Hm; mildly annoying:
        ggbApi.setCoords(this.$ggbLabel, x, this.$yCoord());
      },
      $yCoord() {
        return ggbApi.getYcoord(this.$ggbLabel);
      },
      $setYCoord(y) {
        // Hm; mildly annoying:
        ggbApi.setCoords(this.$ggbLabel, this.$xCoord(), y);
      },
      $color() {
        return ggbApi.getColor(this.$ggbLabel);
      },
      $setColor(color) {
        const mRGB = parseColorOrFail(color);
        ggbApi.setColor(this.$ggbLabel, ...mRGB);
      },
      $fireUpdateEvents() {
        this.$updateHandlers.forEach((fun) => {
          try {
            Sk.misceval.callsimOrSuspend(fun);
          } catch (e) {
            skApi.onError(e);
          }
        });
      },
    },
    methods: {
      when_moved: {
        $meth(pyFun) {
          this.$updateHandlers.push(pyFun);
          return pyFun;
        },
        $flags: { OneArg: true },
      },
    },
    getsets: {
      x: {
        $get() {
          return new Sk.builtin.float_(this.$xCoord());
        },
        $set(pyX) {
          throwIfNotNumber(pyX, "x coord");
          this.$setXCoord(Sk.ffi.remapToJs(pyX));
        },
      },
      y: {
        $get() {
          return new Sk.builtin.float_(this.$yCoord());
        },
        $set(pyY) {
          throwIfNotNumber(pyY, "y coord");
          this.$setYCoord(Sk.ffi.remapToJs(pyY));
        },
      },
      color: {
        $get() {
          return new Sk.builtin.str(this.$color());
        },
        $set(pyColor) {
          if (!Sk.builtin.checkString(pyColor))
            throw new Sk.builtin.TypeError("color must be string");
          // TODO: It must also be the right sort of string.
          // "red" OK
          // "#00FF00" OK
          this.$setColor(Sk.ffi.remapToJs(pyColor));
        },
      },
    },
  });

  mod.Circle = Sk.abstr.buildNativeClass("Circle", {
    constructor: function Circle(spec) {
      const ggbArgs = (() => {
        switch (spec.kind) {
          case "center-radius":
            return `${spec.center.$ggbLabel},${strOfNumber(spec.radius)}`;
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
    },
    slots: {
      tp$new(args, _kwargs) {
        const spec = (() => {
          switch (args.length) {
            case 2:
              if (!Sk.builtin.isinstance(args[0], mod.Point).v) {
                throw new Sk.builtin.TypeError(
                  `bad Circle() ctor arg[0] not Point`
                );
              }
              if (Sk.builtin.checkNumber(args[1])) {
                return {
                  kind: "center-radius",
                  center: args[0],
                  radius: args[1].v,
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

              const allNumbers = args.every(Sk.builtin.checkNumber);
              if (allNumbers) {
                return {
                  kind: "center-radius",
                  center: new mod.Point(args[0], args[1]),
                  radius: args[2].v,
                };
              }
              throw new Sk.builtin.TypeError(`bad Circle() ctor args`);

            default:
              throw new Sk.builtin.TypeError(`bad Circle() ctor args`);
          }
        })();
        return new mod.Circle(spec);
      },
    },
  });

  mod.Line = Sk.abstr.buildNativeClass("Line", {
    constructor: function Line(spec) {
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

        const kwOrDefault = (k, isCorrectType, jsDefault) => {
          const mIndex = kwargs.findIndex((x, i) => i % 2 === 0 && x === k);
          console.log(k, kwargs, mIndex);
          if (mIndex === -1) return jsDefault;
          const value = kwargs[mIndex + 1];
          if (!isCorrectType(value)) throw Sk.builtin.TypeError("bad arg type");
          return Sk.ffi.remapToJs(value);
        };

        const kwNumber = (k, jsDefault) => {
          return kwOrDefault(k, Sk.builtin.checkNumber, jsDefault);
        };

        const kwBoolean = (k, jsDefault) => {
          return kwOrDefault(k, Sk.builtin.checkBool, jsDefault);
        };

        const spec = {
          min: args[0].v,
          max: args[1].v,
          increment: kwNumber("increment", 0.1),
          speed: kwNumber("speed", 1.0),
          width: kwNumber("width", 100),
          isAngle: kwBoolean("isAngle", false),
          isHorizontal: kwBoolean("isHorizontal", true),
          isAnimating: kwBoolean("isAnimating", false),
          isRandom: kwBoolean("isRandom", false),
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

  const namesForExport = Sk.ffi.remapToPy([
    "Point",
    "Circle",
    "Line",
    "Slider",
    "Distance",
  ]);

  mod.__name__ = new Sk.builtin.str("ggb");
  mod.__all__ = namesForExport;

  return mod;
}
