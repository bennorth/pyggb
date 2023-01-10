// TODO: Replace this with proper type:
export type GgbApi = any;

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

export type SkulptApi = {
  onError: (error: PyError) => void;
};
