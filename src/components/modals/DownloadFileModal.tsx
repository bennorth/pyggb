import React from "react";
import { PyGgbModel } from "../../model";
import { DownloadFsmState } from "../../model/modals/download-file";
import { Actions, State } from "easy-peasy";

type DownloadFileModalProps = {
  fileTypeDisplayName: string;
  selectFsmState: (state: State<PyGgbModel>) => DownloadFsmState;
  selectFilename: (state: State<PyGgbModel>) => string;
  selectSetFilename: (actions: Actions<PyGgbModel>) => (v: string) => void;
};
export const DownloadFileModal: React.FC<DownloadFileModalProps> = ({
  fileTypeDisplayName,
  selectFsmState,
  selectFilename,
  selectSetFilename,
}) => {
};
