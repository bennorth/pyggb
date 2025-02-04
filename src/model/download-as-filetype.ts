import { State, Thunk } from "easy-peasy";
import { PyGgbModel } from ".";
import { downloadFile, DownloadFile } from "./modals/download-file";
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
  downloadPy: downloadFile("", ".py", {
    type: "text/x-python",
    endings: "native",
  }),

  downloadGgb: downloadFile(kEmptyU8ArrayBuffer, ".ggb", {
    type: "application/vnd.geogebra.file",
  }),
};
