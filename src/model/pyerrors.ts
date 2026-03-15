import { action, Action, computed, Computed } from "easy-peasy";
import {
  SkBaseException,
  SkBaseExceptionGeneric,
  SkTracebackEntry,
  SkulptApi,
} from "../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi; // eslint-disable-line no-var

export type SkTracebackEntryWithId = {
  id: number;
  entry: SkTracebackEntry;
};

/** Exception where each traceback entry has an ID, for use as a react
 * key when rendering a list of traceback entries. */
export type SkBaseExceptionWithIds =
  SkBaseExceptionGeneric<SkTracebackEntryWithId>;

/** Thin wrapper round an "exception whose traceback entries have IDs";
 * the wrapper object itself has an ID.  The IDs are used as react keys
 * when rendering a list of exceptions (=errors).
 * */
type ExceptionWithId = {
  id: number;
  error: SkBaseExceptionWithIds;
};

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
