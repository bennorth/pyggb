// Requires existence of map $hexRgbFromNamedColour on globalThis.

import {
  augmentedSkulptApi,
  SkObject,
  SkulptApi,
} from "../shared/vendor-types/skulptapi";
declare var Sk: SkulptApi;

const tryParseHexColor = (color: string): [number, number, number] | null => {
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

const tryParseColor = (rawColor: string): [number, number, number] | null => {
  const hexRgbFromNamedColour: Map<string, string> = (globalThis as any)
    .$hexRgbFromNamedColour;

  const lcColor = rawColor.toLowerCase();
  const mHex = hexRgbFromNamedColour.get(lcColor);
  const color = mHex ?? lcColor;

  return tryParseHexColor(color);
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

export const interpretColorOrFail = (
  color: SkObject
): [number, number, number] => {
  if (Sk.builtin.checkString(color)) {
    return parseColorOrFail(color.v);
  }

  if (
    augmentedSkulptApi.checkList(color) ||
    augmentedSkulptApi.checkTuple(color)
  ) {
    const components = color.v;

    if (components.length !== 3) {
      throw new Sk.builtin.ValueError(
        `if a list/tuple, "color" must have three elements`
      );
    }

    if (components.every(augmentedSkulptApi.checkInt)) {
      if (components.every((x) => x.v >= 0 && x.v < 256))
        return [components[0].v, components[1].v, components[2].v];
      throw new Sk.builtin.ValueError(
        `if "color" is a list/tuple of ints, each must be >=0 and <=255`
      );
    }

    if (components.every(augmentedSkulptApi.checkFloat)) {
      if (components.every((x) => x.v >= 0.0 && x.v <= 1.0)) {
        // There are various ways to map the closed interval [0, 1] to
        // the set {0, 1, ..., 255}.  Pick a reasonable one:
        const intComponents = components.map((x) => Math.round(x.v * 255.0));
        return [intComponents[0], intComponents[1], intComponents[2]];
      }
      throw new Sk.builtin.ValueError(
        `if "color" is a list/tuple of floats, each must be >=0.0 and <=1.0`
      );
    }
  }

  throw new Sk.builtin.ValueError(
    `"color" must be string, or list/tuple of three ints/floats`
  );
};
