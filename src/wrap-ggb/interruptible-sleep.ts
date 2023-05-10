import { AppApi } from "../shared/appApi";
import { throwIfNotNumber } from "./shared";
import { SkObject, SkulptApi } from "../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi;

export interface SleepInterruptionActions {
  pause(): void;
  stop(): void;
}

export interface PauseResolutionActions {
  resume(): void;
  stop(): void;
}

export interface RunControlClient {
  handleStartRun(): void;
  handleEnterSleep(actions: SleepInterruptionActions): void;
  handleResumeSleepingRun(): void;
  handleEnterPause(actions: PauseResolutionActions): void;
  handleResumePausedRun(): void;
  handleFinishRun(): void;
}

type SleepState = {
  resolvePromise(value: SkObject): void;
  rejectPromise(reason: any): void;
  timeoutId: ReturnType<typeof setTimeout>;
};

const nullSleepState = {
  resolvePromise(_value: SkObject) {},
  rejectPromise(_reason: any) {},
  timeoutId: null as any,
};

export function interruptibleSleep(
  client: RunControlClient,
  pyDelayS: SkObject
) {
  throwIfNotNumber(pyDelayS, "delay");
  const delayMs = 1000 * pyDelayS.v;

  const useZeroDelay = (window as any)["PYGGB_CYPRESS"]?.ZERO_DELAY ?? false;
  const effectiveDelayMs = useZeroDelay ? 0 : delayMs;

  let sleepState: SleepState = nullSleepState;

  const sleepPromise = new Promise<SkObject>((resolve, reject) => {
    const resumeSleepingRun = () => {
      client.handleResumeSleepingRun();
      resolve(Sk.builtin.none.none$);
    };

    sleepState = {
      resolvePromise: resolve,
      rejectPromise: reject,
      timeoutId: setTimeout(resumeSleepingRun, effectiveDelayMs),
    };
  });

  const resolveWithNone = () =>
    sleepState.resolvePromise(Sk.builtin.none.none$);

  const rejectWithSystemExit = () =>
    sleepState.rejectPromise(new Sk.builtin.SystemExit());

  client.handleEnterSleep({
    pause() {
      clearTimeout(sleepState.timeoutId);
      client.handleEnterPause({
        resume() {
          client.handleResumePausedRun();
          resolveWithNone();
        },
        stop() {
          client.handleResumePausedRun();
          rejectWithSystemExit();
        },
      });
    },
    stop() {
      clearTimeout(sleepState.timeoutId);
      client.handleResumeSleepingRun();
      rejectWithSystemExit();
    },
  });

  return Sk.misceval.promiseToSuspension(sleepPromise);
}

export function register(mod: any, appApi: AppApi) {
  const runControlClient = appApi.ui.runControlClient;

  mod.interruptible_sleep = new Sk.builtin.func((delay) =>
    interruptibleSleep(runControlClient, delay)
  );
}
