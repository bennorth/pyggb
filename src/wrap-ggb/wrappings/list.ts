import { RegisterFun } from "../../shared/appApi";
import { augmentedGgbApi, SkGgbObject, WrapExistingCtorSpec } from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";
import { registerObjectType } from "../type-registry";

declare var Sk: SkulptApi; // eslint-disable-line no-var

interface SkGgbList extends SkGgbObject {
  // TODO
}

type SkGgbListCtorSpec =
  | WrapExistingCtorSpec
  /* TODO */ ;

export const register: RegisterFun = (mod, appApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("List", {
    slots: {
    },
  });

  mod.List = cls;
  registerObjectType("list", cls);
};
