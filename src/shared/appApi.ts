import { GgbApi } from "./vendor-types/ggbapi";
import { RunControlClient } from "../wrap-ggb/interruptible-sleep";
export { type GgbApi } from "./vendor-types/ggbapi";

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

export type SkulptInteractionApi = {
  onError: (error: PyError) => void;
};

export type UiApi = {
  clearConsole: () => void;
  runControlClient: RunControlClient;
};

export type AppApi = {
  ggb: GgbApi;
  sk: SkulptInteractionApi;
  ui: UiApi;
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
