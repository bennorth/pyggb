// Requires existence of map $hexRgbFromNamedColour on globalThis.

import { SkulptApi } from "./skulptapi";
declare var Sk: SkulptApi;

const tryParseColor = (rawColor: string): [number, number, number] | null => {
  const hexRgbFromNamedColour: Map<string, string> = (globalThis as any)
    .$hexRgbFromNamedColour;

  const lcColor = rawColor.toLowerCase();
  const mHex = hexRgbFromNamedColour.get(lcColor);
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

/** Attempt to interpret the given `color` as a color, and, if
 * successful return a triple `[r, g, b]` of RGB values, each an integer
 * between 0 and 255.  The given `color` can be a CSS color name, or a
 * `#`-prefixed 3-digit or 6-digit hex value.  If the given `color` is
 * not of one of these forms, throw a `ValueError`. */
export const parseColorOrFail = (color: string): [number, number, number] => {
  const mRGB = tryParseColor(color);
  if (mRGB == null)
    throw new Sk.builtin.ValueError(`the color "${color}" is not recognised`);
  return mRGB;
};
