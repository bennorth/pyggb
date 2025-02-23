import { State, thunk, Thunk } from "easy-peasy";
import { PyGgbModel } from ".";
import { downloadFile, DownloadFile } from "./modals/download-file";
import { decode as binaryStringFromBase64 } from "base-64";
import { OperationalBackingFileStatus } from "./editor";
import { GgbApi } from "../shared/vendor-types/ggbapi";

export type DownloadAsFiletype = {
  runDownloadPy: Thunk<DownloadAsFiletype, void, void, PyGgbModel>;
  runDownloadGgb: Thunk<DownloadAsFiletype, void, void, PyGgbModel>;

  downloadPy: DownloadFile<string>;
  downloadGgb: DownloadFile<ArrayBuffer>;
};

const kEmptyU8ArrayBuffer = new Uint8Array(0).buffer;

function arrayBufferFromStr(str: string): ArrayBuffer {
  var buffer = new ArrayBuffer(str.length);
  var dataView = new DataView(buffer);
  for (var i = 0; i < str.length; ++i) {
    dataView.setUint8(i, str.charCodeAt(i));
  }
  return buffer;
}

type StateWithOperationalBackingFileStatus = State<PyGgbModel> & {
  editor: { backingFileState: { status: OperationalBackingFileStatus } };
};

type StateWithNonNullGgbApi = State<PyGgbModel> & {
  dependencies: { ggbApi: GgbApi };
};

export function selectCanDownloadPy(
  state: State<PyGgbModel>
): state is StateWithOperationalBackingFileStatus {
  return state.editor.backingFileState.status !== "booting";
}

export function selectCanDownloadGgb(
  state: State<PyGgbModel>
): state is StateWithOperationalBackingFileStatus & StateWithNonNullGgbApi {
  return (
    state.editor.backingFileState.status !== "booting" &&
    state.dependencies.allReady &&
    state.dependencies.ggbApi != null
  );
}

export let downloadAsFiletype: DownloadAsFiletype = {
  runDownloadPy: thunk(async (a, _voidPayload, helpers) => {
    const storeState = helpers.getStoreState();
    if (!selectCanDownloadPy(storeState)) {
      console.log("runDownloadPy(): cannot download");
      return;
    }

    const suggestedFileName = storeState.editor.backingFileState.name;
    const content = storeState.editor.codeText;
    await a.downloadPy.run({ suggestedFileName, content });
  }),

  runDownloadGgb: thunk(async (a, _voidPayload, helpers) => {
    const storeState = helpers.getStoreState();
    if (!selectCanDownloadGgb(storeState)) {
      console.log("runDownloadGgb(): cannot download");
      return;
    }

    const suggestedFileName = storeState.editor.backingFileState.name;

    const ggbApi = storeState.dependencies.ggbApi;
    const contentB64 = ggbApi.getBase64();
    const contentStr = binaryStringFromBase64(contentB64);
    const content = arrayBufferFromStr(contentStr);

    await a.downloadGgb.run({ suggestedFileName, content });
  }),

  downloadPy: downloadFile("", ".py", {
    type: "text/x-python",
    endings: "native",
  }),

  downloadGgb: downloadFile(kEmptyU8ArrayBuffer, ".ggb", {
    type: "application/vnd.geogebra.file",
  }),
};
