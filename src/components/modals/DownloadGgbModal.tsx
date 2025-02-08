import React from "react";
import { DownloadFileModal } from "./DownloadFileModal";

export const DownloadGgbModal: React.FC<{}> = () => {
  return (
    <DownloadFileModal
      fileTypeDisplayName="Ggb"
      selectFilename={(s) => s.downloadAsFiletype.downloadGgb.filename}
      selectFsmState={(s) => s.downloadAsFiletype.downloadGgb.fsmState}
      selectSetFilename={(a) => a.downloadAsFiletype.downloadGgb.setFilename}
    />
  );
};
