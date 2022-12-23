import { action, Action } from "easy-peasy";

export type NewFile = {
  active: boolean;
  setActive: Action<NewFile, boolean>;
};

export const newFile: NewFile = {
  active: false,
  setActive: action((s, active) => {
    s.active = active;
  }),
};
