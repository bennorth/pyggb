import { Thunk } from "easy-peasy";
import { PyGgbModel } from ".";
import { DownloadFile } from "./modals/download-file";

export type DownloadAsFiletype = {
  runDownloadPy: Thunk<DownloadAsFiletype, void, void, PyGgbModel>;
  runDownloadGgb: Thunk<DownloadAsFiletype, void, void, PyGgbModel>;

  downloadPy: DownloadFile<string>;
  downloadGgb: DownloadFile<ArrayBuffer>;
};

function arrayBufferFromStr(str: string): ArrayBuffer {
  var buffer = new ArrayBuffer(str.length);
  var dataView = new DataView(buffer);
  for (var i = 0; i < str.length; ++i) {
    dataView.setUint8(i, str.charCodeAt(i));
  }
  return buffer;
}
