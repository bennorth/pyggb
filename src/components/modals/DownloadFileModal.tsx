import React, { KeyboardEvent } from "react";
import { PyGgbModel } from "../../model";
import { DownloadFsmState } from "../../model/modals/download-file";
import { Actions, State } from "easy-peasy";
import { useStoreActions, useStoreState } from "../../store";

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
  const fsmState = useStoreState(selectFsmState);
  const filename = useStoreState(selectFilename);
  const setFilename = useStoreActions(selectSetFilename);

  if (fsmState.kind === "idle") {
    return null;
  }

  const settle = fsmState.userSettle;

  const downloadEnabled = filename !== "";

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    console.log(e);
    if (e.key === "Enter") {
      if (downloadEnabled) {
        settle("submit");
      }
      e.preventDefault();
    }
  };
};
