import { Action, Thunk, thunk } from "easy-peasy";
import { propSetterAction } from "../../shared/utils";

type FailedFileFromQueryState =
  | { kind: "idle" }
  | { kind: "awaiting-user-acknowledgment"; message: string };

const kIdleFailedFileFromQueryState = { kind: "idle" } as const;

export type FailedFileFromQuery = {
  state: FailedFileFromQueryState;
  setState: Action<FailedFileFromQuery, FailedFileFromQueryState>;

  launch: Thunk<FailedFileFromQuery, string>;
  dismiss: Thunk<FailedFileFromQuery>;
};
