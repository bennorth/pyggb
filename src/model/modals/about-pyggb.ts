import { Action } from "easy-peasy";
import { propSetterAction } from "../../shared/utils";

export type AboutPyGgb = {
  active: boolean;
  setActive: Action<AboutPyGgb, boolean>;
};

export const aboutPyGgb: AboutPyGgb = {
  active: false,
  setActive: propSetterAction("active"),
};
