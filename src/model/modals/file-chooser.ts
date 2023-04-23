import { Action } from "easy-peasy";
import { propSetterAction } from "../../shared/utils";
import { UserFilePreview } from "../../shared/db";

export type FileChoiceActivity =
  | { kind: "none" }
  | { kind: "choose-user-file" }
  | { kind: "choose-example" }
  | ({ kind: "confirm-delete-user-file" } & UserFilePreview);

export type FileChooser = {
  active: boolean;
  setActive: Action<FileChooser, boolean>;
};

export const fileChooser: FileChooser = {
  active: false,
  setActive: propSetterAction("active"),
};
