import { GgbApi } from "./vendor-types/ggbapi";
import { RunControlClient } from "../wrap-ggb/interruptible-sleep";
import { SkBaseException } from "./vendor-types/skulptapi";
import { HidInputReportEventClient } from "../model/web-hid";

export type SkulptInteractionApi = {
  onError: (error: SkBaseException) => void;
};

export type UiApi = {
  clearConsole: () => void;
  runControlClient: RunControlClient;
};

export type HidApi = {
  clearRegistration(): void;
  register(client: HidInputReportEventClient): Promise<void>;
};

export type AppApi = {
  ggb: GgbApi;
  sk: SkulptInteractionApi;
  ui: UiApi;
  hid: HidApi;
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
