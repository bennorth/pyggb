import { GgbApi } from "../shared/vendor-types/ggbapi";
import {
  argumentString,
  isGgbObject,
  isPythonOrGgbNumber,
  numberValueOrLabel,
  SkGgbObject,
} from "./shared";
import { SkBool, SkObject, SkulptApi } from "../shared/vendor-types/skulptapi";
import { wrapExistingGgbObject } from "./type-registry";

declare var Sk: SkulptApi; // eslint-disable-line no-var

type BuildCommand = (vArg: string, wArg: string) => string;

const ggbInfix =
  (opSymbol: string): BuildCommand =>
  (vArg, wArg) =>
    `(${vArg})${opSymbol}(${wArg})`;

const ggbFunctionCall =
  (funName: string): BuildCommand =>
  (vArg, wArg) =>
    `${funName}(${vArg},${wArg})`;

const kBinaryOpTypeError = new Sk.builtin.TypeError(
  "operand arguments must be GeoGebra objects or numbers"
);

const ggbBinaryOpFun =
  (buildCommand: BuildCommand) =>
  (ggbApi: GgbApi, v: SkObject, w: SkObject) => {
    const vArg = argumentString(ggbApi, v, kBinaryOpTypeError);
    const wArg = argumentString(ggbApi, w, kBinaryOpTypeError);
    const ggbCmd = buildCommand(vArg, wArg);

    const lbl = ggbApi.evalCommandGetLabels(ggbCmd);
    if (lbl == null) {
      throw new Sk.builtin.RuntimeError("binary operation failed");
    }

    return wrapExistingGgbObject(ggbApi, lbl);
  };

const ggbAdd = ggbBinaryOpFun(ggbInfix("+"));
const ggbSubtract = ggbBinaryOpFun(ggbInfix("-"));
const ggbMultiply = ggbBinaryOpFun(ggbInfix("*"));
const ggbDivide = ggbBinaryOpFun(ggbInfix("/"));
const ggbPower = ggbBinaryOpFun(ggbInfix("^"));
const ggbRemainder = ggbBinaryOpFun(ggbFunctionCall("Mod"));

const ggbNegative = (ggbApi: GgbApi, v: SkGgbObject) => {
  const ggbCmd = `-${v.$ggbLabel}`;
  const lbl = ggbApi.evalCommandGetLabels(ggbCmd);
  return wrapExistingGgbObject(ggbApi, lbl);
};

export const ggbCompare = (
  ggbApi: GgbApi,
  v: SkObject,
  w: SkObject,
  ggbOp: string
) => ggbBinaryOpFun(ggbInfix(ggbOp))(ggbApi, v, w);

const ggbPyBoolOfCompare = (
  ggbApi: GgbApi,
  v: SkObject,
  w: SkObject,
  ggbOp: string
) => {
  const pyGgbBool = ggbCompare(ggbApi, v, w, ggbOp);
  // TODO: Should the following be method on mod.Boolean cls?
  const pyBool = new Sk.builtin.bool(ggbApi.getValue(pyGgbBool.$ggbLabel));
  ggbApi.deleteObject(pyGgbBool.$ggbLabel);
  return pyBool;
};

export type OperationSlots = {
  nb$add(this: SkObject, other: SkObject): SkObject;
  nb$reflected_add(this: SkGgbObject, other: SkObject): SkObject;
  nb$subtract(this: SkGgbObject, other: SkObject): SkObject;
  nb$reflected_subtract(this: SkGgbObject, other: SkObject): SkObject;
  nb$multiply(this: SkGgbObject, other: SkObject): SkObject;
  nb$reflected_multiply(this: SkGgbObject, other: SkObject): SkObject;
  nb$divide(this: SkGgbObject, other: SkObject): SkObject;
  nb$reflected_divide(this: SkGgbObject, other: SkObject): SkObject;
  nb$remainder(this: SkGgbObject, other: SkObject): SkObject;
  nb$reflected_remainder(this: SkGgbObject, other: SkObject): SkObject;
  nb$power(this: SkGgbObject, other: SkObject): SkObject;
  nb$reflected_power(this: SkGgbObject, other: SkObject): SkObject;
  nb$negative(this: SkGgbObject): SkObject;

  ob$eq(this: SkGgbObject, other: SkObject): SkBool;
  ob$ne(this: SkGgbObject, other: SkObject): SkBool;
  ob$lt(this: SkGgbObject, other: SkObject): SkBool;
  ob$le(this: SkGgbObject, other: SkObject): SkBool;
  ob$gt(this: SkGgbObject, other: SkObject): SkBool;
  ob$ge(this: SkGgbObject, other: SkObject): SkBool;
};

/** Construct and return an object which contains properties
 * corresponding to various Skulpt "slots".  The slots provided are the
 * numeric operation slots `nb$⋯` and the comparison operator slots
 * `op$⋯`.  The given `ggbApi` is captured by the functions in the
 * returned object and used for interaction with GeoGebra. */
export function operationSlots(ggbApi: GgbApi): OperationSlots {
  function nb$add(this: SkObject, other: SkObject) {
    return ggbAdd(ggbApi, this, other);
  }
  function nb$reflected_add(this: SkGgbObject, other: SkObject) {
    return ggbAdd(ggbApi, other, this);
  }
  function nb$subtract(this: SkGgbObject, other: SkObject) {
    return ggbSubtract(ggbApi, this, other);
  }
  function nb$reflected_subtract(this: SkGgbObject, other: SkObject) {
    return ggbSubtract(ggbApi, other, this);
  }
  function nb$multiply(this: SkGgbObject, other: SkObject) {
    return ggbMultiply(ggbApi, this, other);
  }
  function nb$reflected_multiply(this: SkGgbObject, other: SkObject) {
    return ggbMultiply(ggbApi, other, this);
  }
  function nb$divide(this: SkGgbObject, other: SkObject) {
    return ggbDivide(ggbApi, this, other);
  }
  function nb$reflected_divide(this: SkGgbObject, other: SkObject) {
    return ggbDivide(ggbApi, other, this);
  }
  function nb$remainder(this: SkGgbObject, other: SkObject) {
    return ggbRemainder(ggbApi, this, other);
  }
  function nb$reflected_remainder(this: SkGgbObject, other: SkObject) {
    return ggbRemainder(ggbApi, other, this);
  }
  function nb$power(this: SkGgbObject, other: SkObject) {
    return ggbPower(ggbApi, this, other);
  }
  function nb$reflected_power(this: SkGgbObject, other: SkObject) {
    return ggbPower(ggbApi, other, this);
  }
  function nb$negative(this: SkGgbObject) {
    return ggbNegative(ggbApi, this);
  }

  function ob$eq(this: SkGgbObject, other: SkObject) {
    return ggbPyBoolOfCompare(ggbApi, this, other, "==");
  }
  function ob$ne(this: SkGgbObject, other: SkObject) {
    return ggbPyBoolOfCompare(ggbApi, this, other, "!=");
  }
  function ob$lt(this: SkGgbObject, other: SkObject) {
    return ggbPyBoolOfCompare(ggbApi, this, other, "<");
  }
  function ob$le(this: SkGgbObject, other: SkObject) {
    return ggbPyBoolOfCompare(ggbApi, this, other, "<=");
  }
  function ob$gt(this: SkGgbObject, other: SkObject) {
    return ggbPyBoolOfCompare(ggbApi, this, other, ">");
  }
  function ob$ge(this: SkGgbObject, other: SkObject) {
    return ggbPyBoolOfCompare(ggbApi, this, other, ">=");
  }

  return {
    nb$add,
    nb$reflected_add,
    nb$subtract,
    nb$reflected_subtract,
    nb$multiply,
    nb$reflected_multiply,
    nb$divide,
    nb$reflected_divide,
    nb$remainder,
    nb$reflected_remainder,
    nb$power,
    nb$reflected_power,
    nb$negative,
    ob$eq,
    ob$ne,
    ob$lt,
    ob$le,
    ob$gt,
    ob$ge,
  };
}
