import { RegisterFun } from "../../shared/appApi";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";
import { augmentedGgbApi, SkGgbObject, WrapExistingCtorSpec } from "../shared";
import { registerObjectType } from "../type-registry";

declare var Sk: SkulptApi; // eslint-disable-line no-var

export const register: RegisterFun = (mod, appApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  function numberArgStrings(
    args: Array<SkObject>,
    errorMessage: string
  ): Array<string> {
    if (!args.every(ggb.isPythonOrGgbNumber)) {
      throw new Sk.builtin.TypeError(errorMessage);
    }
    return args.map(ggb.numberValueOrLabel);
  }

  function createFunctionObject(cmd: string) {
    const lbl = ggb.evalCmd(cmd);
    return ggb.wrapExistingGgbObject(lbl);
  }
};
