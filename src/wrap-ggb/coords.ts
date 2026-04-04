import { GgbApi } from "../shared/vendor-types/ggbapi";
import { SkObject, SkulptApi } from "../shared/vendor-types/skulptapi";
import { ReadWriteProperty, SkGgbObject, throwIfNotNumber } from "./shared";

declare var Sk: SkulptApi; // eslint-disable-line no-var

export type CoordinateProtoSlice = {
  $xCoord(this: CoordinateProtoSlice): number;
  $setXCoord(this: CoordinateProtoSlice, x: number): void;
  $yCoord(this: CoordinateProtoSlice): number;
  $setYCoord(this: CoordinateProtoSlice, y: number): void;
};

export type SkGgbObjectWithCoords = SkGgbObject & CoordinateProtoSlice;

export function coordinateProtoSlice(ggb: GgbApi): CoordinateProtoSlice {
  return {
    $xCoord(this: SkGgbObjectWithCoords) {
      return ggb.getXcoord(this.$ggbLabel);
    },
    $setXCoord(this: SkGgbObjectWithCoords, x: number) {
      // Hm; mildly annoying:
      ggb.setCoords(this.$ggbLabel, x, this.$yCoord());
    },
    $yCoord(this: SkGgbObjectWithCoords) {
      return ggb.getYcoord(this.$ggbLabel);
    },
    $setYCoord(this: SkGgbObjectWithCoords, y: number) {
      // Hm; mildly annoying:
      ggb.setCoords(this.$ggbLabel, this.$xCoord(), y);
    },
  };
}

export type CoordinateGetSets = {
  x: ReadWriteProperty;
  y: ReadWriteProperty;
};

export const coordinateGetSets: CoordinateGetSets = {
  x: {
    $get(this: SkGgbObjectWithCoords) {
      return new Sk.builtin.float_(this.$xCoord());
    },
    $set(this: SkGgbObjectWithCoords, pyX: SkObject) {
      // Throw if not isIndependent(this)?
      throwIfNotNumber(pyX, "x coord");
      this.$setXCoord(pyX.v);
    },
  },
  y: {
    $get(this: SkGgbObjectWithCoords) {
      return new Sk.builtin.float_(this.$yCoord());
    },
    $set(this: SkGgbObjectWithCoords, pyY: SkObject) {
      throwIfNotNumber(pyY, "y coord");
      this.$setYCoord(Sk.ffi.remapToJs(pyY));
    },
  },
};
