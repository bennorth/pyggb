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

export function interruptibleSleep(
  pyDelayS: SkObject
) {
  throwIfNotNumber(pyDelayS, "delay");
  const delayMs = 1000 * pyDelayS.v;
  // TODO
}

export function register(mod: any, appApi: AppApi) {
  // TODO
}
