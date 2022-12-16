import { action, Action, computed, Computed, thunk, Thunk } from "easy-peasy";

type BootStatus = "idle" | "running" | "done";

export type Dependencies = {
  bootStatus: BootStatus;
  ggbPythonModuleText: string;

  setGgbPythonModuleText: Action<Dependencies, string>;
};

export const dependencies: Dependencies = {
  bootStatus: "idle",
  ggbPythonModuleText: "",

  setGgbPythonModuleText: action((s, moduleText) => {
    s.ggbPythonModuleText = moduleText;
  }),
};
