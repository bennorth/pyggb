type DownloadFileLaunchArgs<ContentT> = {
  suggestedFileName: string;
  content: ContentT;
};

type UserSettleResult = "cancel" | "submit";
type UserSettleFun = (result: UserSettleResult) => void;
const kIgnoreSettleResult: UserSettleFun = () => void 0;
