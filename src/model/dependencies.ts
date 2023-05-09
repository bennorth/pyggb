import { Action, computed, Computed, thunk, Thunk } from "easy-peasy";
import { PyGgbModel } from ".";
import { GgbApi } from "../shared/vendor-types/ggbapi";
import { SkulptGgbModuleUrl } from "../shared/resources";
import { db } from "../shared/db";
import { propSetterAction, propSetterNonNullAction } from "../shared/utils";

type BootStatus = "idle" | "running" | "done";

export type Dependencies = {
  bootStatus: BootStatus;
  ggbApi: GgbApi | null;
  ggbPythonModuleText: string;

  allReady: Computed<Dependencies, boolean>;

  setBootStatus: Action<Dependencies, BootStatus>;
  setGgbApi: Action<Dependencies, GgbApi>;
  setGgbPythonModuleText: Action<Dependencies, string>;

  boot: Thunk<Dependencies, void, {}, PyGgbModel>;
};

export const dependencies: Dependencies = {
  bootStatus: "idle",
  ggbApi: null,
  ggbPythonModuleText: "",

  allReady: computed((s) => s.ggbApi !== null && s.bootStatus === "done"),

  setBootStatus: propSetterAction("bootStatus"),
  setGgbApi: propSetterNonNullAction("ggbApi"),
  setGgbPythonModuleText: propSetterAction("ggbPythonModuleText"),

  boot: thunk(async (a, _voidPayload, helpers) => {
    const allActions = helpers.getStoreActions();
    const status = helpers.getState().bootStatus;
    if (status !== "idle") return;

    a.setBootStatus("running");

    const response = await fetch(SkulptGgbModuleUrl);
    const text = await response.text();
    a.setGgbPythonModuleText(text);

    await db.withLock(async () => {
      await db.ensureUserFilesNonEmpty();
      const fileIdToBootWith = await db.mostRecentlyOpenedPreview();
      await allActions.editor._loadFromBacking(fileIdToBootWith);
    });

    a.setBootStatus("done");
  }),
};
