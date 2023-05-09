import { action, Action, computed, Computed } from "easy-peasy";
import { SkBaseException, SkulptApi } from "../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi;

export type PyErrors = {
  errors: Array<SkBaseException>;
  any: Computed<PyErrors, boolean>;
  appendError: Action<PyErrors, SkBaseException>;
  clearErrors: Action<PyErrors>;
};

export const pyErrors: PyErrors = {
  errors: [],
  any: computed((s) => s.errors.length !== 0),
  appendError: action((s, error) => {
    if (Sk.builtin.isinstance(error, Sk.builtin.SystemExit).v) {
      // This is what gets raised when the user hits the Stop button.
      return;
    }
    s.errors.push(error);
  }),
  clearErrors: action((s) => {
    s.errors = [];
  }),
};
