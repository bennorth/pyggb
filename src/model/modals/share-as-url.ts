type ShareAsUrlState =
  | { kind: "idle" }
  | { kind: "computing" }
  | { kind: "ready"; url: string };

const idleState: ShareAsUrlState = { kind: "idle" };
