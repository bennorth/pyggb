import { useStoreState } from "../../store";
import {
  selectCanDownloadGgb,
  selectCanDownloadPy,
} from "../download-as-filetype";

export function useCanDownloadPy() {
  return useStoreState(selectCanDownloadPy);
}

export function useCanDownloadGgb() {
  return useStoreState(selectCanDownloadGgb);
}
