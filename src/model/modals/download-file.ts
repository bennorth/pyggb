import { Action, generic, Generic, thunk, Thunk } from "easy-peasy";
import { saveAs } from "file-saver";
import { propSetterAction } from "../../shared/utils";

type DownloadFileLaunchArgs<ContentT> = {
  suggestedFileName: string;
  content: ContentT;
};

type UserSettleResult = "cancel" | "submit";
type UserSettleFun = (result: UserSettleResult) => void;
const kIgnoreSettleResult: UserSettleFun = () => void 0;

export type DownloadFsmState =
  | { kind: "idle" }
  | { kind: "interacting"; userSettle: UserSettleFun };

const kFsmStateIdle: DownloadFsmState = { kind: "idle" };

export type DownloadFile<ContentT> = {
  fsmState: DownloadFsmState;
  setFsmState: Action<DownloadFile<ContentT>, DownloadFsmState>;

  filename: string;
  setFilename: Action<DownloadFile<ContentT>, string>;

  content: Generic<ContentT>;
  setContent: Action<DownloadFile<ContentT>, ContentT>;

  run: Thunk<DownloadFile<ContentT>, DownloadFileLaunchArgs<ContentT>>;
};

export function downloadFile<ContentT extends BlobPart>(
  placeholderContent: ContentT,
  fileExtension: string,
  blobCtorOptions: BlobPropertyBag
): DownloadFile<ContentT> {
  return {
    fsmState: kFsmStateIdle,
    setFsmState: propSetterAction("fsmState"),

    content: generic(placeholderContent),
    setContent: propSetterAction("content"),

    filename: "",
    setFilename: propSetterAction("filename"),

    run: thunk(async (a, { suggestedFileName, content }, helpers) => {
      a.setFilename(suggestedFileName);
      a.setContent(content);

      let userSettle = kIgnoreSettleResult;
      const userSettlePromise = new Promise<UserSettleResult>((resolve) => {
        userSettle = resolve;
      });

      a.setFsmState({ kind: "interacting", userSettle });

      try {
        const settleResult = await userSettlePromise;
        if (settleResult === "cancel") return;

        const { filename, content } = helpers.getState();

        const effectiveFilename = filename.endsWith(fileExtension)
          ? filename
          : `${filename}${fileExtension}`;

        const contentBlob = new Blob([content], blobCtorOptions);

        saveAs(contentBlob, effectiveFilename);
      } finally {
        a.setFsmState(kFsmStateIdle);
      }
    }),
  };
}
