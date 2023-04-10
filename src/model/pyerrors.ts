import { action, Action, computed, Computed } from "easy-peasy";
import { PyError } from "../shared/appApi";

declare var Sk: any; // TODO: Get proper type from wrapping code?

export type PyErrors = {
  errors: Array<PyError>;
  any: Computed<PyErrors, boolean>;
  appendError: Action<PyErrors, PyError>;
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
