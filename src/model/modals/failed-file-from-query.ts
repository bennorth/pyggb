import { Action, Thunk, thunk } from "easy-peasy";
import { propSetterAction } from "../../shared/utils";

type FailedFileFromQueryState =
  | { kind: "idle" }
  | { kind: "awaiting-user-acknowledgment"; message: string };

const kIdleFailedFileFromQueryState = { kind: "idle" } as const;
