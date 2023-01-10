import { action, Action, computed, Computed } from "easy-peasy";
import { PyError } from "../shared/appApi";

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
    s.errors.push(error);
  }),
  clearErrors: action((s) => {
    s.errors = [];
  }),
};
