import { Action, Generic, Thunk } from "easy-peasy";

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
