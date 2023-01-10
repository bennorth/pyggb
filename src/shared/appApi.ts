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

export type AppApi = {
  ggb: GgbApi;
  sk: SkulptApi;
};

(globalThis as any).$appApiHandoverQueue = (() => {
  let queue: Array<AppApi> = [];

  const enqueue = (api: AppApi): void => {
    queue.push(api);
  };

  const dequeue = (): AppApi => {
    const api = queue.shift();
    if (api == null) throw new Error("api queue empty!");

    return api;
  };

  return { enqueue, dequeue };
})();
