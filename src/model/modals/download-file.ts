import { Action, generic, Generic, Thunk } from "easy-peasy";
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
  };
}
