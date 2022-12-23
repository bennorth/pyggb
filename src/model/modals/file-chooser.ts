import { action, Action } from "easy-peasy";

export type FileChooser = {
  active: boolean;
  setActive: Action<FileChooser, boolean>;
};

export const fileChooser: FileChooser = {
  active: false,
  setActive: action((s, active) => {
    s.active = active;
  }),
};
