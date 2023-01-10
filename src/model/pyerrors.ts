import { action, Action } from "easy-peasy";
import { PyError } from "../shared/skulpt-interaction";

export type PyErrors = {
  errors: Array<PyError>;
  appendError: Action<PyErrors, PyError>;
  clearErrors: Action<PyErrors>;
};

export const pyErrors: PyErrors = {
  errors: [],
  appendError: action((s, error) => {
    s.errors.push(error);
  }),
  clearErrors: action((s) => {
    s.errors = [];
  }),
};
