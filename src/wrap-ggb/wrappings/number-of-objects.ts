import { RegisterFun } from "../../shared/appApi";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi; // eslint-disable-line no-var

export const register: RegisterFun = (mod, appApi) => {
  const ggb = appApi.ggb;

  const fun = new Sk.builtin.func((...args) => {
    if (args.length !== 0)
      throw new Sk.builtin.TypeError("bad NumberOfObjects() args; need 0 args");
    return new Sk.builtin.int_(ggb.getObjectNumber());
  });

  mod.NumberOfObjects = fun;
};
