import { FileChooser, fileChooser } from "./file-chooser";
import { NewFile, newFile } from "./new-file";
import { AboutPyGgb, aboutPyGgb } from "./about-pyggb";
import { ShareAsUrl, shareAsUrl } from "./share-as-url";
import {
  FailedFileFromQuery,
  failedFileFromQuery,
} from "./failed-file-from-query";

export type Modals = {
  fileChooser: FileChooser;
  newFile: NewFile;
  aboutPyGgb: AboutPyGgb;
  shareAsUrl: ShareAsUrl;
  failedFileFromQuery: FailedFileFromQuery;
};

export const modals: Modals = {
  fileChooser,
  newFile,
  aboutPyGgb,
  shareAsUrl,
  failedFileFromQuery,
};
