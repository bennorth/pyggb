import React from "react";
import { DownloadFileModal } from "./DownloadFileModal";

export const DownloadPythonModal: React.FC<{}> = () => {
  return (
    <DownloadFileModal
      fileTypeDisplayName="Python"
      selectFilename={(s) => s.downloadAsFiletype.downloadPy.filename}
      selectFsmState={(s) => s.downloadAsFiletype.downloadPy.fsmState}
      selectSetFilename={(a) => a.downloadAsFiletype.downloadPy.setFilename}
    />
  );
};
