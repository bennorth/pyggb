import { action, Action, computed, Computed, thunk, Thunk } from "easy-peasy";

type BootStatus = "idle" | "running" | "done";

export type Dependencies = {
  bootStatus: BootStatus;
  ggbApi: any;
  ggbPythonModuleText: string;

  allReady: Computed<Dependencies, boolean>;

  setGgbApi: Action<Dependencies, any>;
  setGgbPythonModuleText: Action<Dependencies, string>;
};

export const dependencies: Dependencies = {
  bootStatus: "idle",
  ggbApi: null,
  ggbPythonModuleText: "",

  allReady: computed((s) => s.ggbApi !== null && s.ggbPythonModuleText !== ""),

  setGgbApi: action((s, api) => {
    s.ggbApi = api;
  }),
  setGgbPythonModuleText: action((s, moduleText) => {
    s.ggbPythonModuleText = moduleText;
  }),
};
