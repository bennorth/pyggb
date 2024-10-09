import { action, Action, computed, Computed, thunk, Thunk } from "easy-peasy";
import { PyGgbModel } from ".";
import { GgbApi } from "../shared/vendor-types/ggbapi";
import { kSkulptGgbModuleUrl } from "../shared/resources";
import { db, UserFilePreview } from "../shared/db";
import { assertNever, fetchAsText, propSetterAction } from "../shared/utils";
import { SemaphoreItem } from "../shared/semaphore";
import { decode as stringFromUtf8BinaryString } from "utf8";
import { decode as binaryStringFromB64String } from "base-64";
import { AsyncInflateOptions, decompress, strFromU8, strToU8 } from "fflate";
import { URLSearchParams } from "url";
import { publicIndexUrl } from "./index-url";
import { UiLayout } from "./ui";

type CodeCompressionKind = "none" | "zlib";

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

type BootStatus = "idle" | "running" | "awaiting-ggb-api" | "done";

async function decompressedPerKind(
  data: Uint8Array,
  compressionKind: CodeCompressionKind
): Promise<Uint8Array> {
  switch (compressionKind) {
    case "none":
      return data;
    case "zlib":
      return zlibDecompress(data, {});
    default:
      return assertNever(compressionKind);
  }
}

async function codeFromQuery(
  b64Code: string,
  compressionKind: CodeCompressionKind
): Promise<string> {
  // See comment in share-as-url.ts regarding the dancing back and
  // forth with data types and representations here.
  const bstrCompressedCode = binaryStringFromB64String(b64Code);
  const u8sCompressedCode = strToU8(bstrCompressedCode, true);
  const u8sCode = await decompressedPerKind(u8sCompressedCode, compressionKind);
  const codeText = stringFromUtf8BinaryString(strFromU8(u8sCode));
  return codeText;
}

type ActionAfterChoosingProgram = {
  userFile: UserFilePreview;
  autoRun: boolean;
  uiLayout: UiLayout;
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
      return loadAction;
    };

    const [, loadAction] = await Promise.all([
      fetchSkulptGgbCode(),
      loadInitialUserCode(),
    ]);

    // Postpone injecting the Ggb applet until the layout is fixed, otherwise
    // attempting to run the code doesn't work because (I think) it gets a stale
    // Ggb API object.  See also useEffect() logic in <GeoGebraPane>.

    allActions.uiSettings.setUiLayout(loadAction.uiLayout);
    a.setBootStatus("awaiting-ggb-api");
    await helpers.getState().ggbApiReady.acquire();
    a.setBootStatus("done");

    if (loadAction.autoRun) {
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

    // For use if auto-creating a project.  Force-replace the address
    // with one including the "index.html", otherwise if the user
    // re-shares, they get a URL without "index.html", and then the
    // server-side redirection from (e.g.) "/python/?blah" to
    // "/python/index.html" can drop the query string, depending on
    // http-server configuration.  Ugh.
    const indexUrl = publicIndexUrl();

    // Initial code is taken from one of three places:
    //
    // If the URL includes the query param "newBlank", create a new
    // project called "New project" and no code.  (If the user already
    // has a project called "New project" whose contents are not empty,
    // create an empty "New project (1)", etc.)
    //
    // If the user got here via a "share" link, decode that link.
    //
    // Otherwise, use the most recent program they were working on,
    // creating one if this is the first time they've ever used the app.

    const startWithBlank = urlSearchParams.has("newBlank");
    if (startWithBlank) {
      window.history.replaceState(null, "", indexUrl);
      const descriptor = { name: "New project", codeText: "" };
      const userFile = await db.getOrCreateNew(descriptor);
      const uiLayout: UiLayout = "full";
      return { userFile, autoRun: false, uiLayout };
    }

    const name = urlSearchParams.get("name");
    const b64Code = urlSearchParams.get("code");
    const compressionKind = (urlSearchParams.get("cck") ??
      "zlib") as CodeCompressionKind;

    if (name == null || b64Code == null) {
      // No/malformed sharing link.  Fetch most recent user program.
      const userFile = await a._mostRecentUserFilePreview();
      const uiLayout: UiLayout = "full";
      return { userFile, autoRun: false, uiLayout };
    }

    // Create program from URL data.
    try {
      window.history.replaceState(null, "", indexUrl);

      const codeText = await codeFromQuery(b64Code, compressionKind);
      const descriptor = { name, codeText };
      const userFile = await db.getOrCreateNew(descriptor);

      // Default is to auto-run; specify autorun=false to inhibit.
      const autoRun = urlSearchParams.get("autorun") !== "false";

      const justCanvas = urlSearchParams.get("justCanvas") === "true";
      const uiLayout: UiLayout = justCanvas ? "ggb-construction-only" : "full";
      return { userFile, autoRun, uiLayout };
    } catch {
      allActions.modals.failedFileFromQuery.launch(
        "Sorry, something went wrong trying to use that link." +
          "  Opening your most recent program instead."
      );

      const userFile = await a._mostRecentUserFilePreview();

      const uiLayout: UiLayout = "full";
      return { userFile, autoRun: false, uiLayout };
    }
  }),
};
