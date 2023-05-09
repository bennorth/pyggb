import { Action, thunk, Thunk } from "easy-peasy";
import { propSetterAction } from "../../shared/utils";

export type NewFile = {
  active: boolean;
  setActive: Action<NewFile, boolean>;
  initialCodeText: string | undefined;
  setInitialCodeText: Action<NewFile, string | undefined>;

  launch: Thunk<NewFile, string | undefined>;
};

export const newFile: NewFile = {
  active: false,
  setActive: propSetterAction("active"),

  initialCodeText: undefined,
  setInitialCodeText: propSetterAction("initialCodeText"),

  launch: thunk((a, codeText) => {
    a.setInitialCodeText(codeText);
    a.setActive(true);
  }),
};
