import { GgbApi } from "./vendor-types/ggbapi";
import { RunControlClient } from "../wrap-ggb/interruptible-sleep";
import { SkBaseException } from "./vendor-types/skulptapi";

export type SkulptInteractionApi = {
  onError: (error: SkBaseException) => void;
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
