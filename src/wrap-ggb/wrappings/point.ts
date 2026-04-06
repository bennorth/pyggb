import { RegisterFun } from "../../shared/appApi";
import {
  augmentedGgbApi,
  withPropertiesFromNameValuePairs,
  SkGgbObject,
  labelGetSets,
} from "../shared";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";
import { registerObjectType } from "../type-registry";
import { SkGgbObjectWithCoords } from "../coords";
import {
  constructIfMatching,
  ggbArgumentStr,
  SignatureSpec,
} from "../command-invocation";
import { GgbApi } from "../../shared/vendor-types/ggbapi";

declare var Sk: SkulptApi; // eslint-disable-line no-var

interface SkGgbPoint extends SkGgbObjectWithCoords {
  $ggbNumberX: SkGgbObject;
  $ggbNumberY: SkGgbObject;
}

const makeCoordinatesCommand = (ggb: GgbApi, args: Array<SkObject>) => {
  const argStrs = args.map((arg) => ggbArgumentStr(ggb, arg));
  return `(${argStrs[0]},${argStrs[1]})`;
};

const kCtorSignatures: Array<SignatureSpec> = [
  {
    argTypes: ["either-number", "either-number"],
    ggbCommand: makeCoordinatesCommand,
  },
  {
    argTypes: ["ggb-object"],
    errorMessage: (ggb, pyArgs) => {
      const objArg = pyArgs[0] as SkGgbObject;
      return (
        "Point(object, parameter): could not find arbitrary point" +
        ` along "${ggb.getObjectType(objArg.$ggbLabel)}" object`
      );
    },
  },
  {
    argTypes: ["ggb-object", "either-number"],
    errorMessage: (ggb, pyArgs) => {
      const objArg = pyArgs[0] as SkGgbObject;
      return (
        "Point(object, parameter): could not find point" +
        ` along "${ggb.getObjectType(objArg.$ggbLabel)}" object`
      );
    },
  },
];

export const register: RegisterFun = (mod, appApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);
  const skApi = appApi.sk;

  const cls = Sk.abstr.buildNativeClass("Point", {
    constructor: function Point(this: SkGgbPoint, ggbLabel: string) {
      this.$ggbLabel = ggbLabel;

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
        return withPropertiesFromNameValuePairs(
          constructIfMatching(appApi.ggb, kCtorSignatures, "Point", args, cls),
          kwargs
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
      ...ggb.sharedCoordinateProtoSlots,
      $fireUpdateEvents(this: SkGgbPoint) {
        this.$updateHandlers.forEach((fun) => {
          try {
            Sk.misceval.callsimOrSuspend(fun);
          } catch (e) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            skApi.onError(e as any);
          }
        });
      },
    },
    methods: {
      when_moved: {
        $meth(this: SkGgbPoint, pyFun: SkObject) {
          this.$updateHandlers.push(pyFun);
          return pyFun;
        },
        $flags: { OneArg: true },
      },
      ...ggb.withPropertiesMethodsSlice,
      ...ggb.freeCopyMethodsSlice,
      ...ggb.deleteMethodsSlice,
    },
    getsets: {
      latex: ggb.sharedGetSets.latex,
      is_visible: ggb.sharedGetSets.is_visible,
      is_fixed: ggb.sharedGetSets.is_fixed,
      is_independent: ggb.sharedGetSets.is_independent,
      color: ggb.sharedGetSets.color,
      color_floats: ggb.sharedGetSets.color_floats,
      size: ggb.sharedGetSets.size,
      x: ggb.sharedGetSets.x,
      x_number: {
        $get(this: SkGgbPoint) {
          return this.$ggbNumberX;
        },
      },
      y: ggb.sharedGetSets.y,
      y_number: {
        $get(this: SkGgbPoint) {
          return this.$ggbNumberY;
        },
      },
      ...labelGetSets(ggb.sharedGetSets),
      _ggb_label: ggb.sharedGetSets._ggb_label,
      _ggb_type: ggb.sharedGetSets._ggb_type,
      _ggb_exists: ggb.sharedGetSets._ggb_exists,
    },
  });

  mod.Point = cls;
  registerObjectType("point", cls);
};
