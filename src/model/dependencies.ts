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

    const loadAction = await a._bootInitialCode(urlSearchParams);

    await allActions.editor.loadFromBacking(loadAction.userFile);

    a.setBootStatus("done");

    if (loadAction.autoRun) {
      allActions.controls.runProgram();
    }
  }),

  _bootInitialCode: thunk(async (_a, urlSearchParams, helpers) => {
    const allActions = helpers.getStoreActions();

    // Initial code is taken from one of two places.  If the user got
    // here via a "share" link, decode that link.  Otherwise, use the
    // most recent program they were working on, creating one if this is
    // the first time they've ever used the app.

    const name = urlSearchParams.get("name");
    const b64Code = urlSearchParams.get("code");
    if (name == null || b64Code == null) {
      // No/malformed sharing link.  Fetch most recent user program.
      const userFile = await db.withLock(async () => {
        await db.ensureUserFilesNonEmpty();
        return await db.mostRecentlyOpenedPreview();
      });

      return { userFile, autoRun: false };
    }

    // Create program from URL data.
    try {
      const publicUrl = process.env.PUBLIC_URL;
      const rootUrl = publicUrl === "" ? "/" : publicUrl;
      window.history.replaceState(null, "", rootUrl);

      // See comment in share-as-url.ts regarding the dancing back and
      // forth with data types and representations here.
      const bstrZlibCode = binaryStringFromB64String(b64Code);
      const u8sCode = await zlibDecompress(strToU8(bstrZlibCode, true), {});
      const codeText = stringFromUtf8BinaryString(strFromU8(u8sCode));

      const descriptor = { name, codeText };
      const userFile = await db.getOrCreateNew(descriptor);

      // Default is to auto-run; specify autorun=false to inhibit.
      const autoRun = urlSearchParams.get("autorun") !== "false";

      return { userFile, autoRun };
    } catch {
      allActions.modals.failedFileFromQuery.launch(
        "Sorry, something went wrong trying to use that link." +
          "  Opening your most recent program instead."
      );

      const userFile = await db.withLock(async () => {
        await db.ensureUserFilesNonEmpty();
        return await db.mostRecentlyOpenedPreview();
      });

      return { userFile, autoRun: false };
    }
  }),
};
