import { FileChooser, fileChooser } from "./file-chooser";
import { NewFile, newFile } from "./new-file";
import { DownloadPython, downloadPython } from "./download-python";
import { AboutPyGgb, aboutPyGgb } from "./about-pyggb";
import { ShareAsUrl, shareAsUrl } from "./share-as-url";

export type Modals = {
  fileChooser: FileChooser;
  newFile: NewFile;
  downloadPython: DownloadPython;
  aboutPyGgb: AboutPyGgb;
  shareAsUrl: ShareAsUrl;
};

export const modals: Modals = {
  fileChooser,
  newFile,
  downloadPython,
  aboutPyGgb,
  shareAsUrl,
};
