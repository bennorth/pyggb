import { action, Action, computed, Computed, thunk, Thunk } from "easy-peasy";
import { PyGgbModel } from ".";
import { GgbApi } from "../shared/vendor-types/ggbapi";
import { kSkulptGgbModuleUrl } from "../shared/resources";
import { db, UserFilePreview } from "../shared/db";
import { fetchAsText, propSetterAction } from "../shared/utils";
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

  _mostRecentUserFilePreview: Thunk<
    Dependencies,
    void,
    {},
    PyGgbModel,
    Promise<UserFilePreview>
  >;

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

  allReady: computed((s) => s.bootStatus === "done"),

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

    const fetchSkulptGgbCode = async () => {
      // TODO: Should we handle failure to load Skulpt Ggb module code?
      const text = await fetchAsText(kSkulptGgbModuleUrl);
      a.setGgbPythonModuleText(text!);
    };

    const loadInitialUserCode = async () => {
      const loadAction = await a._bootInitialCode(urlSearchParams);
      await allActions.editor.loadFromBacking(loadAction.userFile);
      return loadAction.autoRun;
    };

    const [, , autoRun] = await Promise.all([
      fetchSkulptGgbCode(),
      helpers.getState().ggbApiReady.acquire(),
      loadInitialUserCode(),
    ]);

    a.setBootStatus("done");

    if (autoRun) {
      allActions.controls.runProgram();
    }
  }),

  _mostRecentUserFilePreview: thunk(
    async (_a) =>
      await db.withLock(async () => {
        await db.ensureUserFilesNonEmpty();
        return await db.mostRecentlyOpenedPreview();
      })
  ),

  _bootInitialCode: thunk(async (a, urlSearchParams, helpers) => {
    const allActions = helpers.getStoreActions();

    // Initial code is taken from one of two places.  If the user got
    // here via a "share" link, decode that link.  Otherwise, use the
    // most recent program they were working on, creating one if this is
    // the first time they've ever used the app.

    const name = urlSearchParams.get("name");
    const b64Code = urlSearchParams.get("code");
    if (name == null || b64Code == null) {
      // No/malformed sharing link.  Fetch most recent user program.
      const userFile = await a._mostRecentUserFilePreview();
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

      const userFile = await a._mostRecentUserFilePreview();

      return { userFile, autoRun: false };
    }
  }),
};
