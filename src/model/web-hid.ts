import { Action, Thunk, action, thunk } from "easy-peasy";
import { propSetterAction } from "../shared/utils";

type DeviceAcquisitionStatus =
  | "not-yet-requested"
  | "requesting"
  | "failed"
  | "succeeded";

export type WebHid = {
  acquisitionStatus: DeviceAcquisitionStatus;
  setAcquisitionStatus: Action<WebHid, DeviceAcquisitionStatus>;
};

export let webHid: WebHid = {
  acquisitionStatus: "not-yet-requested",
  setAcquisitionStatus: propSetterAction("acquisitionStatus"),
};
