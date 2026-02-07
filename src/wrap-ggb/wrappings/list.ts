import { RegisterFun } from "../../shared/appApi";
import { augmentedGgbApi, SkGgbObject, WrapExistingCtorSpec } from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";
import { registerObjectType } from "../type-registry";
import { throwBadSpecKind } from "../../shared/utils";

declare var Sk: SkulptApi; // eslint-disable-line no-var

interface SkGgbList extends SkGgbObject {
  // TODO
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
    slots: {
    },
  });

  mod.List = cls;
  registerObjectType("list", cls);
};
