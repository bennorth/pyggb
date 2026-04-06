import { RegisterFun } from "../../shared/appApi";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi; // eslint-disable-line no-var

export const register: RegisterFun = (mod, appApi) => {
  const uiApi = appApi.ui;

  mod.ClearConsole = new Sk.builtin.func(function ClearConsole(...args) {
    if (args.length !== 0)
      throw new Sk.builtin.TypeError("bad ClearConsole() args; need 0 args");
    uiApi.clearConsole();
    return Sk.builtin.none.none$;
  });
};
