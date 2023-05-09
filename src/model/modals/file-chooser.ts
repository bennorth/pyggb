import { Action } from "easy-peasy";
import { propSetterAction } from "../../shared/utils";
import { UserFilePreview } from "../../shared/db";

export type FileChoiceActivity =
  | { kind: "none" }
  | { kind: "choose-user-file" }
  | { kind: "choose-example" }
  | ({ kind: "confirm-delete-user-file" } & UserFilePreview);

export type FileChooser = {
  activity: FileChoiceActivity;
  setActivity: Action<FileChooser, FileChoiceActivity>;
};

export const fileChooser: FileChooser = {
  activity: { kind: "none" },
  setActivity: propSetterAction("activity"),
};
