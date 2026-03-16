import React from "react";
import { DownloadFileModal } from "./DownloadFileModal";
import { EmptyProps } from "../../shared/utils";

export const DownloadPythonModal: React.FC<EmptyProps> = () => {
  return (
    <DownloadFileModal
      fileTypeDisplayName="Python"
      selectFilename={(s) => s.downloadAsFiletype.downloadPy.filename}
      selectFsmState={(s) => s.downloadAsFiletype.downloadPy.fsmState}
      selectSetFilename={(a) => a.downloadAsFiletype.downloadPy.setFilename}
    />
  );
};
