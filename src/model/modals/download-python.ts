import { Action, thunk, Thunk } from "easy-peasy";
import { saveAs } from "file-saver";
import { propSetterAction } from "../../shared/utils";

export type DownloadPythonLaunchArgs = {
  storedName: string;
  content: string;
};

export type DownloadPython = {
  active: boolean;
  setActive: Action<DownloadPython, boolean>;

  filename: string;
  setFilename: Action<DownloadPython, string>;

  content: string;
  setContent: Action<DownloadPython, string>;

  launch: Thunk<DownloadPython, DownloadPythonLaunchArgs>;
  download: Thunk<DownloadPython, void>;
};

export const downloadPython: DownloadPython = {
  active: false,
  content: "",
  filename: "",

  setActive: propSetterAction("active"),
  setContent: propSetterAction("content"),
  setFilename: propSetterAction("filename"),

  launch: thunk((a, { storedName, content }) => {
    a.setFilename(storedName);
    a.setContent(content);
    a.setActive(true);
  }),

  download: thunk((_a, _voidPayload, helpers) => {
    const { filename, content } = helpers.getState();

    const effectiveFilename = filename.endsWith(".py")
      ? filename
      : `${filename}.py`;

    const contentBlob = new Blob([content], {
      type: "text/x-python",
      endings: "native",
    });

    saveAs(contentBlob, effectiveFilename);
  }),
};
