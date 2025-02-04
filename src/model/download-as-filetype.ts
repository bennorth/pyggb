import { Thunk } from "easy-peasy";
import { PyGgbModel } from ".";
import { DownloadFile } from "./modals/download-file";

export type DownloadAsFiletype = {
  runDownloadPy: Thunk<DownloadAsFiletype, void, void, PyGgbModel>;
  runDownloadGgb: Thunk<DownloadAsFiletype, void, void, PyGgbModel>;

  downloadPy: DownloadFile<string>;
  downloadGgb: DownloadFile<ArrayBuffer>;
};
