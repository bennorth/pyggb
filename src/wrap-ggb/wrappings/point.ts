import { AppApi } from "../../shared/appApi";
import {
  augmentedGgbApi,
  throwIfNotNumber,
  withPropertiesFromNameValuePairs,
  SkGgbObject,
  WrapExistingCtorSpec,
  throwIfLabelNull,
  SpecConstructible,
} from "../shared";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";

import { registerObjectType } from "../type-registry";

declare var Sk: SkulptApi;

interface SkGgbPoint extends SkGgbObject {
  $xCoord(this: SkGgbPoint): number;
  $ggbNumberX: SkGgbObject;
  $setXCoord(this: SkGgbPoint, x: number): void;
  $yCoord(this: SkGgbPoint): number;
  $ggbNumberY: SkGgbObject;
  $setYCoord(this: SkGgbPoint, y: number): void;
}

type SkGgbPointCtorSpec =
  | WrapExistingCtorSpec
  | {
      kind: "coordinates";
      x: string;
      y: string;
    }
  | {
      kind: "object-parameter";
      p: string;
      t: SkObject;
    };

export const register = (
  mod: { Point: SpecConstructible<SkGgbPointCtorSpec, SkGgbPoint> },
  appApi: AppApi
) => {
  const ggb = augmentedGgbApi(appApi.ggb);
  const skApi = appApi.sk;

  const cls = Sk.abstr.buildNativeClass("Point", {
    constructor: function Point(this: SkGgbPoint, spec: SkGgbPointCtorSpec) {
      switch (spec.kind) {
        case "coordinates": {
          const cmd = `(${spec.x}, ${spec.y})`;
          const lbl = ggb.evalCmd(cmd);
          this.$ggbLabel = lbl;
          break;
        }
        case "object-parameter": {
          const cmd = `Point(${spec.p}, ${ggb.numberValueOrLabel(spec.t)})`;
          const lbl = ggb.evalCmd(cmd);
          throwIfLabelNull(
            lbl,
            "Point(object, parameter): could not find point" +
              ` along "${ggb.ggbType(spec.p)}" object`
          );
          this.$ggbLabel = lbl;
          break;
        }
        case "wrap-existing":
          this.$ggbLabel = spec.label;
          break;
        default:
          throw new Sk.builtin.TypeError(
            `bad Point() spec.kind "${(spec as any).kind}"`
          );
      }

      // TODO: Would be cleaner to avoid making a new dependent Number
      // if a passed-in coord was already a Number.
      //
      this.$ggbNumberX = ggb.wrapExistingGgbObject(
        ggb.evalCmd(`x(${this.$ggbLabel})`)
      );
      this.$ggbNumberY = ggb.wrapExistingGgbObject(
        ggb.evalCmd(`y(${this.$ggbLabel})`)
      );

      this.$updateHandlers = [];
      ggb.registerObjectUpdateListener(this.$ggbLabel, () =>
        this.$fireUpdateEvents()
      );
    },
    slots: {
      tp$new(args, kwargs) {
        if (args.length === 2) {
          if (args.every(ggb.isPythonOrGgbNumber)) {
            const x = ggb.numberValueOrLabel(args[0]);
            const y = ggb.numberValueOrLabel(args[1]);
            return withPropertiesFromNameValuePairs(
              new mod.Point({ kind: "coordinates", x, y }),
              kwargs
            );
          }

          if (ggb.isGgbObject(args[0]) && ggb.isPythonOrGgbNumber(args[1])) {
            const p = args[0].$ggbLabel;
            const t = args[1];
            return withPropertiesFromNameValuePairs(
              new mod.Point({ kind: "object-parameter", p, t }),
              kwargs
            );
          }
        }

        throw new Sk.builtin.TypeError(
          "Point() arguments must be" +
            " (x_coord, y_coord);" +
            " or (ggb_object, parameter)"
        );
      },
      tp$str(this: SkGgbPoint) {
        return new Sk.builtin.str(`(${this.$xCoord()}, ${this.$yCoord()})`);
      },
      $r(this: SkGgbPoint) {
        return new Sk.builtin.str(
          `Point(${this.$xCoord()}, ${this.$yCoord()})`
        );
      },
      ...ggb.sharedOpSlots,
    },
    proto: {
      $xCoord(this: SkGgbPoint) {
        return ggb.getXcoord(this.$ggbLabel);
      },
      $setXCoord(this: SkGgbPoint, x: number) {
        // Hm; mildly annoying:
        ggb.setCoords(this.$ggbLabel, x, this.$yCoord());
      },
      $yCoord(this: SkGgbPoint) {
        return ggb.getYcoord(this.$ggbLabel);
      },
      $setYCoord(this: SkGgbPoint, y: number) {
        // Hm; mildly annoying:
        ggb.setCoords(this.$ggbLabel, this.$xCoord(), y);
      },
      $fireUpdateEvents(this: SkGgbPoint) {
        this.$updateHandlers.forEach((fun) => {
          try {
            Sk.misceval.callsimOrSuspend(fun);
          } catch (e) {
            skApi.onError(e as any);
          }
        });
      },
    },
    methods: {
      when_moved: {
        $meth(this: SkGgbPoint, pyFun: any) {
          this.$updateHandlers.push(pyFun);
          return pyFun;
        },
        $flags: { OneArg: true },
      },
      ...ggb.withPropertiesMethodsSlice,
      ...ggb.freeCopyMethodsSlice,
    },
    getsets: {
      is_visible: ggb.sharedGetSets.is_visible,
      is_independent: ggb.sharedGetSets.is_independent,
      color: ggb.sharedGetSets.color,
      color_ints: ggb.sharedGetSets.color_ints,
      color_floats: ggb.sharedGetSets.color_floats,
      size: ggb.sharedGetSets.size,
      x: {
        $get(this: SkGgbPoint) {
          return new Sk.builtin.float_(this.$xCoord());
        },
        $set(this: SkGgbPoint, pyX: SkObject) {
          // Throw if not isIndependent(this)?
          throwIfNotNumber(pyX, "x coord");
          this.$setXCoord(pyX.v);
        },
      },
      x_number: {
        $get(this: SkGgbPoint) {
          return this.$ggbNumberX;
        },
      },
      y: {
        $get(this: SkGgbPoint) {
          return new Sk.builtin.float_(this.$yCoord());
        },
        $set(this: SkGgbPoint, pyY: SkObject) {
          throwIfNotNumber(pyY, "y coord");
          this.$setYCoord(Sk.ffi.remapToJs(pyY));
        },
      },
      y_number: {
        $get(this: SkGgbPoint) {
          return this.$ggbNumberY;
        },
      },
      _ggb_type: ggb.sharedGetSets._ggb_type,
    },
  });

  mod.Point = cls;
  registerObjectType("point", cls);
};
