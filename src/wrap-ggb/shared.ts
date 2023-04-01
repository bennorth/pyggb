import { SkulptApi, SkObject } from "./skulptapi";
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
