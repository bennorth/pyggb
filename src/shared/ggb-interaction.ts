// TODO: Replace this with proper type:
export type GgbApi = any;

(globalThis as any).$ggbApiHandoverQueue = (() => {
  let queue: Array<GgbApi> = [];

  const enqueue = (api: GgbApi): void => {
    queue.push(api);
  };

  const dequeue = (): GgbApi => {
    const api = queue.shift();
    if (api == null) console.error("api queue empty!");

    return api;
  };

  return { enqueue, dequeue };
})();
