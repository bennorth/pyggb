import { Action } from "easy-peasy";
import { propSetterAction } from "../../shared/utils";

export type FileChooser = {
  active: boolean;
  setActive: Action<FileChooser, boolean>;
};

export const fileChooser: FileChooser = {
  active: false,
  setActive: propSetterAction("active"),
};
