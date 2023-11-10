import { AppApi } from "../../shared/appApi";
import {
  SkulptApi,
  augmentedSkulptApi,
} from "../../shared/vendor-types/skulptapi";
import { assembledCommand, augmentedGgbApi } from "../shared";

declare var Sk: SkulptApi;

export const register = (mod: any, appApi: AppApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const zoomIn = new Sk.builtin.func((...args) => {
    return Sk.builtin.none.none$;
  });

  mod.ZoomIn = zoomIn;
};
