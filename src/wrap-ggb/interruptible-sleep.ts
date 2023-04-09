import { throwIfNotNumber } from "./shared";
import { SkObject, SkulptApi } from "./skulptapi";

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
  handleEnterSleep(actions: SleepInterruptionActions): void;
  handleResumeSleepingRun(): void;
  handleCancelSleepingRun(): void;
  handleEnterPause(actions: PauseResolutionActions): void;
  handleResumePausedRun(): void;
  handleCancelPausedRun(): void;
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
  // TODO
}

export function register(mod: any, appApi: AppApi) {
  // TODO
}
