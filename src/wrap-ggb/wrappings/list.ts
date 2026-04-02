import { RegisterFun } from "../../shared/appApi";
import { augmentedGgbApi, SkGgbObject, WrapExistingCtorSpec } from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";
import { registerObjectType } from "../type-registry";
import { throwBadSpecKind } from "../../shared/utils";

declare var Sk: SkulptApi; // eslint-disable-line no-var

interface SkGgbList extends SkGgbObject {
  $length: (this: SkGgbList) => number;
}

type SkGgbListCtorSpec =
  | WrapExistingCtorSpec
  | { kind: "empty" }
  | { kind: "iterable"; elements: Array<SkGgbObject> };

export const register: RegisterFun = (mod, appApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("List", {
    constructor: function List(this: SkGgbList, spec: SkGgbListCtorSpec) {
      switch (spec.kind) {
        case "wrap-existing": {
          this.$ggbLabel = spec.label;
          break;
        }
        case "empty": {
          this.$ggbLabel = ggb.evalCmd("{}");
          break;
        }
        case "iterable": {
          const elementLabels = spec.elements.map((elt) => elt.$ggbLabel);
          const ggbCmd = `{${elementLabels.join(",")}}`;
          this.$ggbLabel = ggb.evalCmd(ggbCmd);
          break;
        }
        default:
          throwBadSpecKind("List", spec);
      }
    },
    proto: {
      $length(this: SkGgbList) {
        const ggbCmd = `Length(${this.$ggbLabel})`;
        const ggbLabel = ggb.evalCmd(ggbCmd);
        const nElts = ggb.getValue(ggbLabel);
        ggb.deleteObject(ggbLabel);
        return nElts;
      },
    },
    slots: {
      tp$new(args, kwargs) {
        const badArgsError = new Sk.builtin.TypeError(
          "List() must be called with no arguments," +
            " or with a single iterable argument"
        );

        const make = (spec: SkGgbListCtorSpec) => new mod.List(spec);

        if (kwargs && kwargs.length !== 0) {
          throw badArgsError;
        }
        switch (args.length) {
          case 0:
            return make({ kind: "empty" });
          case 1: {
            const elements = Sk.misceval.arrayFromIterable(args[0]);
            if (!ggb.everyElementIsGgbObject(elements)) {
              throw new Sk.builtin.TypeError(
                "List() argument must be Python iterable of GeoGebra objects"
              );
            }
            return make({ kind: "iterable", elements });
          }
          default:
            throw badArgsError;
        }
      },
      sq$length(this: SkGgbList) {
        return this.$length();
      },
      mp$subscript(pyIndex) {
        const nElts = this.$length();
        const rawIdx0b = Sk.misceval.asIndexSized(pyIndex);
        const idx0b = rawIdx0b >= 0 ? rawIdx0b : rawIdx0b + nElts;
        if (idx0b < 0 || idx0b >= nElts) {
          throw new Sk.builtin.IndexError("List object index out of range");
        }

        const idx1b = idx0b + 1;
        const ggbCmd = `${this.$ggbLabel}(${idx1b})`;
        const eltLabel = ggb.evalCmd(ggbCmd);
        return ggb.wrapExistingGgbObject(eltLabel);
      },
    },
  });

  mod.List = cls;
  registerObjectType("list", cls);
};
