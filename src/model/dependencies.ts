import { action, Action, computed, Computed, thunk, Thunk } from "easy-peasy";
import { PyGgbModel } from ".";
import { GgbApi } from "../shared/vendor-types/ggbapi";
import { SkulptGgbModuleUrl } from "../shared/resources";
import { db, UserFilePreview } from "../shared/db";
import { propSetterAction } from "../shared/utils";
import { SemaphoreItem } from "../shared/semaphore";
import { decode as stringFromUtf8BinaryString } from "utf8";
import { decode as binaryStringFromB64String } from "base-64";
import { AsyncInflateOptions, decompress, strFromU8, strToU8 } from "fflate";
import { URLSearchParams } from "url";

function zlibDecompress(
  data: Uint8Array,
  opts: AsyncInflateOptions
): Promise<Uint8Array> {
  return new Promise<Uint8Array>((resolve, reject) => {
    decompress(data, opts, (err, data) => {
      if (err != null) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

type BootStatus = "idle" | "running" | "done";

type ActionAfterChoosingProgram = {
  userFile: UserFilePreview;
  autoRun: boolean;
};

export type Dependencies = {
  bootStatus: BootStatus;
  ggbApi: GgbApi | null;
  ggbApiReady: SemaphoreItem;
  ggbPythonModuleText: string;

  allReady: Computed<Dependencies, boolean>;

  setBootStatus: Action<Dependencies, BootStatus>;
  setGgbApi: Action<Dependencies, GgbApi>;
  setGgbPythonModuleText: Action<Dependencies, string>;

  boot: Thunk<Dependencies, URLSearchParams, {}, PyGgbModel>;
  _bootInitialCode: Thunk<
    Dependencies,
    URLSearchParams,
    {},
    PyGgbModel,
    Promise<ActionAfterChoosingProgram>
  >;
};

export const dependencies: Dependencies = {
  bootStatus: "idle",
  ggbApi: null,
  ggbApiReady: new SemaphoreItem(1, 1),
  ggbPythonModuleText: "",

  // TODO: Check the argument 'once bootStatus is "done", we must have a
  // non-null ggbApi', and if valid, remove redundancy:
  allReady: computed((s) => s.ggbApi !== null && s.bootStatus === "done"),

  setBootStatus: propSetterAction("bootStatus"),
  setGgbApi: action((state, ggbApi) => {
    state.ggbApi = ggbApi;
    state.ggbApiReady.release();
  }),

  setGgbPythonModuleText: propSetterAction("ggbPythonModuleText"),

  boot: thunk(async (a, urlSearchParams, helpers) => {
    const allActions = helpers.getStoreActions();

    const status = helpers.getState().bootStatus;
    if (status !== "idle") return;

    a.setBootStatus("running");

    // TODO: Do the following jobs in parallel?

    const response = await fetch(SkulptGgbModuleUrl);
    const text = await response.text();
    a.setGgbPythonModuleText(text);

    await helpers.getState().ggbApiReady.acquire();

    await db.withLock(async () => {
      await db.ensureUserFilesNonEmpty();
      const fileIdToBootWith = await db.mostRecentlyOpenedPreview();
      await allActions.editor._loadFromBacking(fileIdToBootWith);
    });

    a.setBootStatus("done");
  }),

  _bootInitialCode: thunk(async (_a, urlSearchParams) => {
    // Initial code is taken from one of two places.  If the user got
    // here via a "share" link, decode that link.  Otherwise, use the
    // most recent program they were working on, creating one if this is
    // the first time they've ever used the app.
  }),
};
