import { AppApi } from "../../shared/appApi";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi;

export const register = (mod: any, appApi: AppApi) => {
  const ggb = appApi.ggb;

  const fun = new Sk.builtin.func((...args) => {
    if (args.length !== 0)
      throw new Sk.builtin.TypeError("bad NumberOfObjects() args; need 0 args");
    return new Sk.builtin.int_(ggb.getObjectNumber());
  });

  mod.NumberOfObjects = fun;
};
