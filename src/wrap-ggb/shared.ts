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
