import { Action } from "easy-peasy";
import { propSetterAction } from "../shared/utils";

export type UiLayout = "full" | "ggb-construction-only";

export type UiSettings = {
  uiLayout: UiLayout;
  setUiLayout: Action<UiSettings, UiLayout>;
};

export let uiSettings: UiSettings = {
  uiLayout: "full",
  setUiLayout: propSetterAction("uiLayout"),
};
