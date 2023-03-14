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

const isSingletonOfEmpty = (xs) => xs.length === 1 && xs[0] === "";

const throwIfNotNumber = (pyObj, objName) => {
  if (!Sk.builtin.checkNumber(pyObj))
    throw new Sk.builtin.TypeError(`${objName} must be a number`);
};

const isInstance = (cls) => (obj) => Sk.builtin.isinstance(obj, cls).v;

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
  const ggbApi = appApi.ggb;
  const skApi = appApi.sk;
  const uiApi = appApi.ui;

  PYGGB_CYPRESS().GGB_API = ggbApi;

  let mod = {};

  const isGgbObject = (obj, requiredType) => {
    // Could collapse the following into one bool expression but it wouldn't
    // obviously be clearer.

    if (!Object.hasOwn(obj, "$ggbLabel")) return false;

    // It is a GGB object.  If we're not fussy about what type, we're done.
    if (requiredType == null) return true;

    // We are fussy about what type; compare.
    const gotType = ggbApi.getObjectType(obj.$ggbLabel);
    return gotType === requiredType;
  };

  const throwIfNotGgb = (obj, objName) => {
    // This might not always be the right test, but it is for now:
    if (!isGgbObject(obj))
      throw new Sk.builtin.TypeError(`${objName} must be a GeoGebra object`);
  };

  const isPythonOrGgbNumber = (obj) =>
    Sk.builtin.checkNumber(obj) || isGgbObject(obj, "numeric");

  const numberValueOrLabel = (x) => {
    if (isGgbObject(x, "numeric")) {
      return x.$ggbLabel;
    }

    if (Sk.builtin.checkNumber(x)) {
      const jsStr = x.v.toExponential();
      const [sig, exp] = jsStr.split("e");
      return `(${sig}*10^(${exp}))`;
    }

    throw new Sk.builtin.RuntimeError("internal error: not Number or number");
  };

  const sharedGetSets = {
    is_visible: {
      $get() {
        return new Sk.builtin.bool(ggbApi.getVisible(this.$ggbLabel));
      },
      $set(pyIsVisible) {
        const isVisible = Sk.misceval.isTrue(pyIsVisible);
        ggbApi.setVisible(this.$ggbLabel, isVisible);
      },
    },
    is_independent: {
      $get() {
        return new Sk.builtin.bool(ggbApi.isIndependent(this.$ggbLabel));
      },
    },
    color: {
      $get() {
        const color = ggbApi.getColor(this.$ggbLabel);
        return new Sk.builtin.str(color);
      },
      $set(pyColor) {
        if (!Sk.builtin.checkString(pyColor))
          throw new Sk.builtin.TypeError("color must be string");
        const mRGB = parseColorOrFail(pyColor.v);
        ggbApi.setColor(this.$ggbLabel, ...mRGB);
      },
    },
    size: {
      $get() {
        return new Sk.builtin.float_(ggbApi.getPointSize(this.$ggbLabel));
      },
      $set(pySize) {
        // TODO: Verify integer and in range [1, 9]
        ggbApi.setPointSize(this.$ggbLabel, pySize.v);
      },
    },
    line_thickness: {
      $get() {
        return new Sk.builtin.int_(ggbApi.getLineThickness(this.$ggbLabel));
      },
      $set(pyThickness) {
        // TODO: Verify integer and in range [1, 13]
        ggbApi.setLineThickness(this.$ggbLabel, pyThickness.v);
      },
    },
  };

  const wrapDependent = (label) => {
    const wrapSpec = { kind: "wrap-existing", label };
    const objectType = ggbApi.getObjectType(label);
    switch (objectType) {
      case "point":
        return new mod.Point(wrapSpec);
      case "numeric":
        return new mod.Number(wrapSpec);
      case "vector":
        return new mod.Vector(wrapSpec);
      case "segment":
        return new mod.Segment(wrapSpec);
      case "boolean":
        return new mod.Boolean(wrapSpec);
      default:
        throw new Sk.builtin.RuntimeError(
          `unknown object-type "${objectType}"` +
            ` when trying to wrap ggb object "${label}"`
        );
    }
  };

  const ggbInfix = (opSymbol) => (vArg, wArg) =>
    `(${vArg})${opSymbol}(${wArg})`;

  const ggbFunctionCall = (funName) => (vArg, wArg) =>
    `${funName}(${vArg},${wArg})`;

  const ggbBinaryOpFun = (buildCommand) => (v, w) => {
    if ([v, w].every(isPythonOrGgbNumber)) {
      const vArg = numberValueOrLabel(v);
      const wArg = numberValueOrLabel(w);
      const ggbCmd = buildCommand(vArg, wArg);
      const lbl = ggbApi.evalCommandGetLabels(ggbCmd);
      return wrapDependent(lbl);
    }
    if ([v, w].every((x) => isGgbObject(x))) {
      const ggbCmd = buildCommand(v.$ggbLabel, w.$ggbLabel);
      const lbl = ggbApi.evalCommandGetLabels(ggbCmd);
      // TODO: What if the addition doesn't make sense?
      return wrapDependent(lbl);
    }
  };

  const ggbAdd = ggbBinaryOpFun(ggbInfix("+"));
  const ggbSubtract = ggbBinaryOpFun(ggbInfix("-"));
  const ggbMultiply = ggbBinaryOpFun(ggbInfix("*"));
  const ggbDivide = ggbBinaryOpFun(ggbInfix("/"));
  const ggbRemainder = ggbBinaryOpFun(ggbFunctionCall("Mod"));

  const ggbNegative = (v) => {
    const ggbCmd = `-${v.$ggbLabel}`;
    const lbl = ggbApi.evalCommandGetLabels(ggbCmd);
    return wrapDependent(lbl);
  };

  const ggbCompare = (v, w, ggbOp) => ggbBinaryOpFun(ggbInfix(ggbOp))(v, w);

  const ggbPyBoolOfCompare = (v, w, ggbOp) => {
    const bool = ggbCompare(v, w, ggbOp);
    const pyBool = Sk.builtin.bool(ggbApi.getValue(bool.$ggbLabel));
    // TODO: Should the following be method on mod.Boolean cls?
    ggbApi.deleteObject(bool.$ggbLabel);
    return pyBool;
  };

  const sharedOpSlots = {
    nb$add(other) {
      return ggbAdd(this, other);
    },
    nb$reflected_add(other) {
      return ggbAdd(this, other);
    },
    nb$negative() {
      return ggbNegative(this);
    },
    nb$subtract(other) {
      return ggbSubtract(this, other);
    },
    nb$reflected_subtract(other) {
      return ggbSubtract(other, this);
    },
    nb$multiply(other) {
      return ggbMultiply(this, other);
    },
    nb$reflected_multiply(other) {
      return ggbMultiply(other, this);
    },
    nb$divide(other) {
      return ggbDivide(this, other);
    },
    nb$reflected_divide(other) {
      return ggbDivide(other, this);
    },
    nb$remainder(other) {
      return ggbRemainder(this, other);
    },
    nb$reflected_remainder(other) {
      return ggbRemainder(other, this);
    },
    ob$eq(other) {
      return ggbPyBoolOfCompare(this, other, "==");
    },
    ob$ne(other) {
      return ggbPyBoolOfCompare(this, other, "!=");
    },
    ob$lt(other) {
      return ggbPyBoolOfCompare(this, other, "<");
    },
    ob$le(other) {
      return ggbPyBoolOfCompare(this, other, "<=");
    },
    ob$gt(other) {
      return ggbPyBoolOfCompare(this, other, ">");
    },
    ob$ge(other) {
      return ggbPyBoolOfCompare(this, other, ">=");
    },
  };

  const withPropertiesFromNameValuePairs = (obj, propNamesValues) => {
    propNamesValues = propNamesValues ?? [];
    if (propNamesValues.length % 2 !== 0) {
      throw new Sk.builtin.RuntimeError(
        "internal error: propNamesValues not in pairs"
      );
    }
    for (let i = 0; i !== propNamesValues.length; i += 2) {
      const propName = propNamesValues[i];
      const propValue = propNamesValues[i + 1];
      obj.tp$setattr(new Sk.builtin.str(propName), propValue);
    }
    return obj;
  };

  const kWithPropertiesMethodsSlice = {
    with_properties: {
      $flags: { FastCall: true },
      $meth(args, kwargs) {
        if (args.length !== 0) throw new Sk.builtin.TypeError("only kwargs");
        return withPropertiesFromNameValuePairs(this, kwargs);
      },
    },
  };

  mod.Point = Sk.abstr.buildNativeClass("Point", {
    constructor: function Point(spec) {
      switch (spec.kind) {
        case "new-from-coords":
          const cmd = `(${spec.x}, ${spec.y})`;
          const lbl = ggbApi.evalCommandGetLabels(cmd);
          this.$ggbLabel = lbl;
          break;
        case "wrap-existing":
          this.$ggbLabel = spec.label;
          break;
        default:
          throw new Sk.builtin.TypeError(
            `bad Point() spec.kind "${spec.kind}"`
          );
      }

      // TODO: Would be cleaner to avoid making a new dependent Number
      // if a passed-in coord was already a Number.
      //
      this.$ggbNumberX = wrapDependent(
        ggbApi.evalCommandGetLabels(`x(${this.$ggbLabel})`)
      );
      this.$ggbNumberY = wrapDependent(
        ggbApi.evalCommandGetLabels(`y(${this.$ggbLabel})`)
      );

      this.$updateHandlers = [];
      ggbApi.registerObjectUpdateListener(this.$ggbLabel, () =>
        this.$fireUpdateEvents()
      );
    },
    slots: {
      tp$new(args, kwargs) {
        Sk.abstr.checkArgsLen("Point", args, 2, 2);
        // TODO: Check args are sensible.
        const x = numberValueOrLabel(args[0]);
        const y = numberValueOrLabel(args[1]);
        return withPropertiesFromNameValuePairs(
          new mod.Point({ kind: "new-from-coords", x, y }),
          kwargs
        );
      },
      tp$str() {
        return new Sk.builtin.str(`(${this.$xCoord()}, ${this.$yCoord()})`);
      },
      $r() {
        return new Sk.builtin.str(
          `Point(${this.$xCoord()}, ${this.$yCoord()})`
        );
      },
      nb$add: sharedOpSlots.nb$add,
      nb$reflected_add: sharedOpSlots.nb$reflected_add,
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
      ...kWithPropertiesMethodsSlice,
    },
    getsets: {
      is_visible: sharedGetSets.is_visible,
      is_independent: sharedGetSets.is_independent,
      color: sharedGetSets.color,
      size: sharedGetSets.size,
      x: {
        $get() {
          return new Sk.builtin.float_(this.$xCoord());
        },
        $set(pyX) {
          // Throw if not isIndependent(this)?
          throwIfNotNumber(pyX, "x coord");
          this.$setXCoord(Sk.ffi.remapToJs(pyX));
        },
      },
      x_number: {
        $get() {
          return this.$ggbNumberX;
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
      y_number: {
        $get() {
          return this.$ggbNumberY;
        },
      },
    },
  });

  mod.Circle = Sk.abstr.buildNativeClass("Circle", {
    constructor: function Circle(spec) {
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

              const allNumbers = args.every(Sk.builtin.checkNumber);
              if (allNumbers) {
                return {
                  kind: "center-radius",
                  center: new mod.Point({
                    kind: "new-from-coords",
                    x: args[0].v,
                    y: args[1].v,
                  }),
                  radius: args[2].v,
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

  mod.Intersect = new Sk.builtin.func((...args) => {
    if (args.length !== 2 || !args.every(isGgbObject))
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
    const points = labels.map(
      (label) => new mod.Point({ kind: "wrap-existing", label })
    );

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
    "Slider",
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
}
