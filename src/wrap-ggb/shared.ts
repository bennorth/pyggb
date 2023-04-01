import { SkulptApi, SkObject, SkInt, SkFloat } from "./skulptapi";
import { GgbApi } from "./ggbapi";

/** A Skulpt object which is also a wrapped GeoGebra object. */
export interface SkGgbObject extends SkObject {
  $ggbLabel: string;
  $updateHandlers: Array<any>;
  $fireUpdateEvents(...args: Array<any>): any;
}

declare var Sk: SkulptApi;

/** Given a JavaScript number `x`, return a string representation of `x`
 * which GeoGebra will interpret correctly.  We don't want to feed
 * exponential notation in the form "4.1693084667370053e-38" directly to
 * GeoGebra.
 * */
export const strOfNumber = (x: number): string => {
  const jsStr = x.toExponential();
  const [sig, exp] = jsStr.split("e");
  return `(${sig}*10^(${exp}))`;
};

/** Given a Skulpt/PyGgb object `cls`, which should be a class object,
 * return a predicate function which tests whether a given Skulpt/PyGgb
 * object is (in the Python sense) an instance of that class.
 *
 * This is a two-step process to facilitate using, for example,
 * `isInstance(someClass)` as the predicate argument of an
 * `Array.every()` call. */
export const isInstance = (cls: SkObject) => (obj: SkObject) =>
  Sk.builtin.isinstance(obj, cls).v;

function _isGgbObject(obj: SkObject): obj is SkGgbObject {
  return "$ggbLabel" in obj;
}

/** Test whether the Skulpt/PyGgb object `obj` is an `SkGgbObject` of
 * the given GeoGebra type `requiredType` (for example, `"circle"`).  If
 * `requiredType` is omitted, test only whether `obj` is an
 * `SkGgbObject`.  The given `ggbApi` is used to get the object's
 * GeoGebra type.
 * */
export const isGgbObject = (
  ggbApi: GgbApi,
  obj: SkObject,
  requiredType?: string
): obj is SkGgbObject => {
  // Could collapse the following into one bool expression but it wouldn't
  // obviously be clearer.

  if (!_isGgbObject(obj)) return false;

  // It is a GGB object.  If we're not fussy about what type, we're done.
  if (requiredType == null) return true;

  // We are fussy about what type; compare.
  const gotType = ggbApi.getObjectType(obj.$ggbLabel);
  return gotType === requiredType;
};

/** Test whether every element of a (JavaScript) array is an
 * `SkGgbObject`.  This is provided explicitly (rather than letting
 * callers use `xs.every(⋯)` instead) to help TypeScript with its
 * type-narrowing. */
const everyElementIsGgbObject = (
  objs: Array<SkObject>
): objs is Array<SkGgbObject> => objs.every(_isGgbObject);

/** Test whether the Skulpt/PyGgb object `obj` is either a Skulpt/Python
 * number or a GeoGebra `numeric` object. */
export const isPythonOrGgbNumber = (ggbApi: GgbApi, obj: SkObject) =>
  Sk.builtin.checkNumber(obj) || isGgbObject(ggbApi, obj, "numeric");

/** Given a Skulpt/PyGgb object `x`, which should be either a `numeric`
 * GeoGebra object or a Python number, return a string suitable for
 * inclusion in a GeoGebra command.  For a `numeric` object, return its
 * label.  For a Python number, return a literal string representation.
 * */
export const numberValueOrLabel = (ggbApi: GgbApi, x: SkObject): string => {
  if (isGgbObject(ggbApi, x, "numeric")) {
    return x.$ggbLabel;
  }

  if (Sk.builtin.checkNumber(x)) {
    const jsStr = x.v.toExponential();
    const [sig, exp] = jsStr.split("e");
    return `(${sig}*10^(${exp}))`;
  }

  // TODO: Can we tighten types to avoid this runtime check?
  throw new Sk.builtin.RuntimeError("internal error: not Number or number");
};

/** Set the attributes in `propNamesValue` (typically Python properties)
 * on the given `obj`, and return `obj`.  The attribute/property names
 * (JavaScript strings) and values (`SkObject` instances) should
 * alternate in the `propNamesValues` array. */
export const withPropertiesFromNameValuePairs = (
  obj: SkObject,
  propNamesValues?: Array<string | SkObject>
) => {
  propNamesValues = propNamesValues ?? [];

  if (propNamesValues.length % 2 !== 0) {
    throw new Sk.builtin.RuntimeError(
      "internal error: propNamesValues not in pairs"
    );
  }

  for (let i = 0; i !== propNamesValues.length; i += 2) {
    // Not easy to tell TypeScript that the name/value pairs alternate
    // within the array, so help it:
    const propName = propNamesValues[i] as string;
    const propPyName = new Sk.builtin.str(propName);
    const propValue = propNamesValues[i + 1] as SkObject;
    obj.tp$setattr(propPyName, propValue);
  }

  return obj;
};

/** Assert that the given `pyObj` is a Python number.  If not, throw a
 * `TypeError`, whose message uses the given `objName`. */
export function throwIfNotNumber(
  pyObj: SkObject,
  objName: string
): asserts pyObj is SkInt | SkFloat {
  if (!Sk.builtin.checkNumber(pyObj))
    throw new Sk.builtin.TypeError(`${objName} must be a number`);
}

type ReadOnlyProperty = {
  $get(this: SkGgbObject): SkObject;
};
type ReadWriteProperty = ReadOnlyProperty & {
  $set(this: SkGgbObject, val: SkObject): void;
};

type SharedGetSets = {
  is_visible: ReadWriteProperty;
  is_independent: ReadOnlyProperty;
  color: ReadWriteProperty;
  size: ReadWriteProperty;
  line_thickness: ReadWriteProperty;
};
