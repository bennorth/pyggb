import { Action } from "easy-peasy";

export type UiLayout = "full" | "ggb-construction-only";

export type UiSettings = {
  uiLayout: UiLayout;
  setUiLayout: Action<UiSettings, UiLayout>;
};
