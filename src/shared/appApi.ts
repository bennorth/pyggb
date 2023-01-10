export type TracebackEntry = {
  lineno: number;
  colno: number;
  filename: string;
};

export type PyError = {
  args: {
    v: { length: number; [0]: { v: string } };
  };
  traceback: Array<TracebackEntry>;
  tp$name: string;
};
