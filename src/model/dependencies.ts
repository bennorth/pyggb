type BootStatus = "idle" | "running" | "done";

export type Dependencies = {
  bootStatus: BootStatus;
};

export const dependencies: Dependencies = {
  bootStatus: "idle",
};
