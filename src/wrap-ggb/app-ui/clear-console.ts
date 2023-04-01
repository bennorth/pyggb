import { AppApi } from "../../shared/appApi";
import { SkulptApi } from "../skulptapi";

declare var Sk: SkulptApi;

export const register = (mod: any, appApi: AppApi) => {
  const uiApi = appApi.ui;

  const fun = new Sk.builtin.func((...args) => {
    if (args.length !== 0)
      throw new Sk.builtin.TypeError("bad ClearConsole() args; need 0 args");
    uiApi.clearConsole();
    return Sk.builtin.none.none$;
  });

  mod.ClearConsole = fun;
};
