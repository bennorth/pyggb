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
