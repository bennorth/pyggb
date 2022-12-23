import { FileChooser, fileChooser } from "./file-chooser";
import { NewFile, newFile } from "./new-file";

export type Modals = {
  fileChooser: FileChooser;
  newFile: NewFile;
};

export const modals: Modals = {
  fileChooser,
  newFile,
};
