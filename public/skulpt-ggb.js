const strOfNumber = (x) => {
  const jsStr = x.toExponential();
  const [sig, exp] = jsStr.split("e");
  return `(${sig}*10^(${exp}))`;
};

function $builtinmodule() {
  const ggbApi = globalThis.$ggbApiHandoverQueue.dequeue();

  let mod = {};

  mod.Point = Sk.abstr.buildNativeClass("Point", {
    constructor: function Point(pyX, pyY) {
      const x = Sk.ffi.remapToJs(pyX);
      const y = Sk.ffi.remapToJs(pyY);

      const cmd = `(${strOfNumber(x)}, ${strOfNumber(y)})`;
      const lbl = ggbApi.evalCommandGetLabels(cmd);

      this.$ggbLabel = lbl;

      this.$updateHandlers = [];
      ggbApi.registerObjectUpdateListener(lbl, () => this.$fireUpdateEvents());
    },
    slots: {
      tp$new(args, kwargs) {
        Sk.abstr.checkNoKwargs("Point", kwargs);
        Sk.abstr.checkArgsLen("Point", args, 2, 2);
        return new mod.Point(...args);
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
        // TODO: Validate input.  Assumes "#rrggbb".
        // need to support "red" as well
        const r = Number.parseInt(color.substring(1, 3), 16);
        const g = Number.parseInt(color.substring(3, 5), 16);
        const b = Number.parseInt(color.substring(5, 7), 16);
        ggbApi.setColor(this.$ggbLabel, r, g, b);
      },
      $fireUpdateEvents() {
        this.$updateHandlers.forEach((fun) => {
          Sk.misceval.callsimOrSuspend(fun);
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
          if (!Sk.builtin.checkNumber(pyX))
            throw new Sk.builtin.TypeError("x coord must be number");
          this.$setXCoord(Sk.ffi.remapToJs(pyX));
        },
      },
      y: {
        $get() {
          return new Sk.builtin.float_(this.$yCoord());
        },
        $set(pyY) {
          if (!Sk.builtin.checkNumber(pyY))
            throw new Sk.builtin.TypeError("y coord must be number");
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

  const namesForExport = Sk.ffi.remapToPy(["Point", "Circle"]);

  mod.__name__ = new Sk.builtin.str("ggb");
  mod.__all__ = namesForExport;

  return mod;
}
