type FailedFileFromQueryState =
  | { kind: "idle" }
  | { kind: "awaiting-user-acknowledgment"; message: string };
