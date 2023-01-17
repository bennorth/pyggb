import { action, Action } from "easy-peasy";

export type NewFile = {
  active: boolean;
  setActive: Action<NewFile, boolean>;
  initialCodeText: string | undefined;
  setInitialCodeText: Action<NewFile, string | undefined>;
};

export const newFile: NewFile = {
  active: false,
  setActive: action((s, active) => {
    s.active = active;
  }),
  initialCodeText: undefined,
  setInitialCodeText: action((s, initialCodeText) => {
    s.initialCodeText = initialCodeText;
  }),
};
