type FailedFileFromQueryState =
  | { kind: "idle" }
  | { kind: "awaiting-user-acknowledgment"; message: string };

const kIdleFailedFileFromQueryState = { kind: "idle" } as const;
