import React from "react";
import { DownloadFileModal } from "./DownloadFileModal";
import { EmptyProps } from "../../shared/utils";

export const DownloadGgbModal: React.FC<EmptyProps> = () => {
  return (
    <DownloadFileModal
      fileTypeDisplayName="Ggb"
      selectFilename={(s) => s.downloadAsFiletype.downloadGgb.filename}
      selectFsmState={(s) => s.downloadAsFiletype.downloadGgb.fsmState}
      selectSetFilename={(a) => a.downloadAsFiletype.downloadGgb.setFilename}
    />
  );
};
