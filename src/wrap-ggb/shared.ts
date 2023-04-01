import { SkulptApi, SkObject } from "./skulptapi";

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
