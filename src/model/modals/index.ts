import { FileChooser, fileChooser } from "./file-chooser";
import { NewFile, newFile } from "./new-file";
import { DownloadPython, downloadPython } from "./download-python";

export type Modals = {
  fileChooser: FileChooser;
  newFile: NewFile;
  downloadPython: DownloadPython;
};

export const modals: Modals = {
  fileChooser,
  newFile,
  downloadPython,
};
